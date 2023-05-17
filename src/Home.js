import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Card, ListGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import NoPost from "./componetns/NoPost";
import { apiKey, apiSecret } from "./constants/constants";
import { FaRegThumbsUp, FaRegCommentAlt } from "react-icons/fa";
import Comments from "./componetns/comments/Comment";
import camera from "./assets/image.png";
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlinePaperAirplane,
  HiOutlineDocumentArrowUp,
} from "react-icons/hi2";
const Home = ({ contract }) => {
  const [posts, setPosts] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);

  const loadPosts = async () => {
    // Get user's address
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
        const headers = {
          "Content-Type": "application/json",
          pinata_api_key: apiKey,

          pinata_secret_api_key: apiSecret,
        };
        const response = await fetch(
          `https://gateway.pinata.cloud/ipfs/${i.hash}`
        );

        console.log(response);
        const q = await response.json();
        const metadataPost = await JSON.parse(q);
        console.log(metadataPost);
        var keyCount = Object.keys(metadataPost).length;

        // get authors nft profile
        const nftId = await contract.profiles(i.author);
        // get uri url of nft profile
        const uri = await contract.tokenURI(nftId);
        // fetch nft profile metadata
        const r = await fetch(uri);
        const m = await r.json();
        const metadataProfile = await JSON.parse(m);

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
          url: metadataPost.url,
          author,
        };
        console.log(post);
        return post;
      })
    );
    posts = posts.sort((a, b) => b.tipAmount - a.tipAmount);
    // Sort posts from most tipped to least tipped.
    setPosts(posts);
    setLoading(false);
  };
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const fileImg = event.target.files[0];
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,

          headers: {
            pinata_api_key: apiKey,
            "Access-Control-Allow-Origin": "*",
            pinata_secret_api_key: apiSecret,
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);

        setUrl(ImgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
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
      const jsonString = JSON.stringify({ post: post, url: url });
      console.log(jsonString);

      const apiUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const headers = {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        pinata_secret_api_key: apiSecret,
      };

      const data = {
        pinataContent: jsonString,
      };
      setUrl("");
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
        value: ethers.utils.parseEther("0.1"),
      })
    ).wait();
    loadPosts();
  };
  if (loading)
    return (
      <div className="text-center">
        <main style={{ marginTop: "300px", marginLeft: "100px" }}>
          <h3>Loading..........</h3>
        </main>
      </div>
    );
  return (
    <div className="container-fluid mt-5" style={{ marginLeft: "100px" }}>
      {hasProfile ? (
        <div className="row">
          <div className="share" style={{ width: "750px" }}>
            <div className="container">
              <div className="top">
                <input
                  type="text"
                  placeholder={`What's on your mind?`}
                  onChange={(e) => setPost(e.target.value)}
                />
              </div>
              <hr />
              <div className="bottom">
                <div className="left">
                  <input type="file" id="file" style={{ display: "none" }} />
                  <div className="item">
                    <img src={camera} alt="" className="icon" />
                    <Form.Control
                      type="file"
                      required
                      name="file"
                      onChange={uploadToIPFS}
                      style={{ textDecoration: "none" }}
                    />
                  </div>
                </div>
                <div className="right">
                  <button
                    onClick={uploadPost}
                    style={{
                      backgroundColor: "#000",
                      width: "100px",
                      borderRadius: "5px",
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoPost></NoPost>
      )}

      {posts.length > 0 ? (
        posts.map((post, key) => {
          if (post.content != undefined) {
            return (
              <div
                key={key}
                className="col-lg-12 my-3 mx-auto"
                style={{ width: "700px", paddingTop: "50px" }}
              >
                <Card
                  border="primary"
                  style={{
                    width: "750px",
                    backgroundColor: "#fffff",
                    border: "none",
                    borderRadius: "20px",
                    height: "100%",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "transparent",
                      width: "700px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="mr-2 profile-image"
                      width="100px"
                      height="100px"
                      style={{ borderRadius: "50%" }}
                      src={post.author.avatar}
                    />
                    <div className="details">
                      <span className="name"> {post.author.username}</span>
                      <span className="date"> {post.author.address}</span>
                    </div>
                  </div>
                  <Card.Body color="secondary">
                    <Card.Text className="post__content font">
                      {post.content}
                    </Card.Text>
                    <img className="post-image" src={post.url} />
                  </Card.Body>
                  <div
                    className="list-group-item"
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <div className="d-inline mt-auto float-start font">
                      <FaRegThumbsUp></FaRegThumbsUp>
                      <span
                        style={{
                          color: "#3808f5",
                          fontWeight: "Bold",
                          paddingLeft: "10px",
                          marginRight: "20px",
                        }}
                      >
                        {ethers.utils.formatEther(post.tipAmount)} ETH{" "}
                      </span>
                    </div>
                    <div>
                      <div
                        className="item"
                        onClick={() => setCommentOpen(!commentOpen)}
                      >
                        <FaRegCommentAlt />
                        Comments
                      </div>
                    </div>
                    {address === post.author.address || !hasProfile ? null : (
                      <div
                        className="d-inline float-end font"
                        onClick={() => tip(post)}
                      >
                        <FaRegThumbsUp></FaRegThumbsUp>{" "}
                        <span> post for 0.1 ETH</span>
                      </div>
                    )}
                  </div>
                  {!commentOpen ? null : (
                    <Comments
                      params={{
                        contract: contract,
                        postid: key,
                        userid: post.author.address,
                      }}
                    ></Comments>
                  )}
                </Card>
              </div>
            );
          }
        })
      ) : (
        <div className="text-center"></div>
      )}
    </div>
  );
};

export default Home;
