import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

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
  const [content, setContent] = useState("");
  const setDetails = (s) => {
    setContent(s);
    setShow(true);
  };
  const [loading, setLoading] = useState(true);

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
        <button
          onClick={() => setShow(false)}
          style={{
            width: "400px",
            height: "50px",
            borderRadius: "10px",
            backgroundColor: "#3808f5",
            border: "none",
            marginLeft: "440px",
            marginBottom: "100px",
          }}
        >
          Go back
        </button>
      </div>
    );
  }
  return (
    <div >
      <h3 style={{ paddingLeft: "60px", paddingTop: "30px" }}>
        Cases reported
      </h3>
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
                      <button onClick={() => setDetails(post)}>View</button>
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
