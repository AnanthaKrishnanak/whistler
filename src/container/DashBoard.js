import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoPost from "../componetns/NoPost";
import PieChart from "../componetns/PieChart";
import "./DashBoard.css";
import Details from "../componetns/Details";
const DashBoard = ({ contract }) => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = "/details";
    navigate(path);
  };

  const [posts, setPosts] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("")
  const setDetails = (s) => {
    setContent(s)
    setShow(true);
  };
  const [loading, setLoading] = useState(true);
  const apiKey = "0a245a6e2144d20c5710";
  const apiSecret =
    "fbd8aaf8b0bf36829293b2e28ccd709ac796b8ff152d375eb3a6035d03196c5f";
  const loadPosts = async () => {
    // Get user's address
    setShow(false);
    let address = await contract.signer.getAddress();
    setAddress(address);
    // Check if user owns an nft
    // and if they do set profile to true
    const balance = await contract.balanceOf(address);
    setHasProfile(() => balance > 0);
    // Get all posts
    let results = await contract.getAllPosts();
    // Fetch metadata of each post and add that to post object.
    let posts = await Promise.all(
      results.map(async (i) => {
        // use hash to fetch the post's metadata stored on ipfs
        let response = await fetch(
          `https://gateway.pinata.cloud/ipfs/${i.hash}`
        );

        const m = await response.json();
        const metadataPost = await JSON.parse(m);
        console.log(metadataPost);
        var keyCount = Object.keys(metadataPost).length;

        // get authors nft profile
        const nftId = await contract.profiles(i.author);
        // get uri url of nft profile
        const uri = await contract.tokenURI(nftId);
        // fetch nft profile metadata
        response = await fetch(uri);
        const prof = await response.json();
        const metadataProfile = await JSON.parse(prof);

        // define author object
        const author = {
          address: i.author,
          username: metadataProfile.user,
          avatar: metadataProfile.image,
        };
        // define post object
        let post = {
          id: i.id,
          content: metadataPost.post,
          tipAmount: i.tipAmount,
          author,
          organization: metadataPost.organization,
          category: metadataPost.category,
          relation: metadataPost.relation,
          encounter: metadataPost.encounter,
          department: metadataPost.department,
          location: metadataPost.location,
          orgid: metadataPost.orgid,
          period: metadataPost.period,
          incident: metadataPost.incident,
          suggestion: metadataPost.suggestion,
          proof: metadataPost.proof,
        };
        return post;
      })
    );
    posts = posts.sort((a, b) => b.tipAmount - a.tipAmount);
    // Sort posts from most tipped to least tipped.
    setPosts(posts);
    setLoading(false);
  };
  useEffect(() => {
    if (!posts) {
      loadPosts();
    }
  });
  const uploadPost = async () => {
    if (!post) return;
    let hash;
    // Upload post to IPFS
    try {
      const jsonString = JSON.stringify({ post });
      console.log(jsonString);

      const apiUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const headers = {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      };

      const data = {
        pinataContent: jsonString,
      };

      await axios
        .post(apiUrl, data, { headers })
        .then(async (response) => {
          console.log(
            `JSON string uploaded successfully. IPFS hash: ${response.data.IpfsHash}`
          );

          setLoading(true);
          await (await contract.uploadPost(response.data.IpfsHash)).wait();
        })
        .catch((error) => {
          console.error("Error uploading JSON string:", error.message);
        });
    } catch (error) {
      window.alert("ipfs image upload error: ", error);
    }
    // upload post to blockchain

    loadPosts();
  };
  const tip = async (post) => {
    // tip post owner
    await (
      await contract.tipPostOwner(post.id, {
        postue: ethers.utils.parseEther("0.1"),
      })
    ).wait();
    loadPosts();
  };
  if (loading)
    return (
      <div className="text-center">
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      </div>
    );
  if (show) {
    return (
      <div>
      <Details content={content}></Details>
      <button onClick={()=>setShow(false)} style={{width:"400px", height:"50px", borderRadius:"10px", backgroundColor:"#3808f5", border:"none",marginLeft:"20px", marginBottom:"100px"}}>Go back</button>
      </div>
   );
  }
  return (
    <div>
      <h3 style={{paddingLeft:"60px", paddingTop:"30px"}}>Cases reported</h3>
      {posts.length > 0 ? (
        <div className="dash">
          <table class="styled-table">
            <tr>
              <th>No.</th>
              <th>Category</th>
              <th>Department</th>
              <th>Organization</th>
              <th>Organization ID</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
            {posts.map((post, key) => {
              if (post.content == undefined) {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{post.category}</td>
                    <td>{post.department}</td>
                    <td>{post.organization}</td>
                    <td>{post.orgid}</td>
                    <td>{post.location}</td>
                    <td>
                      <button onClick={()=>setDetails(post)}>View</button>
                    </td>
                  </tr>
                );
              }
            })}
          </table>
        </div>
      ) : (
        <div className="text-center">No cases reported</div>
      )}
    </div>
  );
};

export default DashBoard;
