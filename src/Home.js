import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import NoPost from "./componetns/NoPost";
import { keccak256 } from "ethers/lib/utils";
const Home = ({ contract }) => {
  const [posts, setPosts] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");

  const apiKey = "0a245a6e2144d20c5710";
  const apiSecret =
    "fbd8aaf8b0bf36829293b2e28ccd709ac796b8ff152d375eb3a6035d03196c5f";
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
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${i.hash}`);

        console.log(response)
        const m = await response.json();
        const metadataPost = await JSON.parse(m);
        console.log(metadataPost);
        var keyCount = Object.keys(metadataPost).length;

        // get authors nft profile
        const nftId = await contract.profiles(i.author);
        // get uri url of nft profile
        const uri = await contract.tokenURI(nftId);
        // fetch nft profile metadata
        const r = await fetch(uri);
        const prof = await r.json();
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
            pinata_secret_api_key: apiSecret,
            "Content-Type": "multipart/form-data",
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
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      </div>
    );
  return (
    <div className="container-fluid mt-5">
      {hasProfile ? (
        <div className="row">
          <main
            role="main"
            className="col-lg-12 mx-auto"
            style={{ maxWidth: "1000px" }}
          >
            <div
              className="content mx-auto"
              style={{ width: "700px", paddingLeft: "20px" }}
            >
              <Row className="g-4">
                <Form.Control
                  onChange={(e) => setPost(e.target.value)}
                  size="lg"
                  required
                  placeholder="Whats happening?"
                  as="textarea"
                  style={{ height: "150px" }}
                />
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={uploadToIPFS}
                />
                <div className="d-grid px-0">
                  <Button onClick={uploadPost} variant="primary" size="lg">
                    Post!
                  </Button>
                </div>
              </Row>
            </div>
          </main>
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
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    height: "100%",
                  }}
                >
                  <Card.Header
                    style={{
                      backgroundColor: "transparent",
                      width: "700px",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <img
                      className="mr-2"
                      width="100px"
                      height="100px"
                      style={{ borderRadius: "50%" }}
                      src={post.author.avatar}
                    />
                    <small
                      className="ms-2 me-auto d-inline font"
                      style={{ color: "black" }}
                    >
                      {post.author.username}
                    </small>
                    <small
                      className="mt-1 float-end d-inline font"
                      style={{ color: "#3808f5", fontWeight: "Bold" }}
                    >
                      {post.author.address}
                    </small>
                  </Card.Header>
                  <Card.Body color="secondary">
                    <Card.Text className="post__content font">
                      {post.content}
                    </Card.Text>
                    <img
                      width="400px"
                      height="200px"
                      style={{ borderRadius: "10px", backgroundColor:"white" }}
                      src={post.url}
                    />
                  </Card.Body>
                  <Card.Footer className="list-group-item">
                    <div className="d-inline mt-auto float-start font">
                      Total Support:{" "}
                      <span style={{ color: "#3808f5", fontWeight: "Bold" }}>
                        {ethers.utils.formatEther(post.tipAmount)} ETH{" "}
                      </span>
                    </div>
                    {address === post.author.address || !hasProfile ? null : (
                      <div className="d-inline float-end font">
                        <Button
                          onClick={() => tip(post)}
                          className="px-0 py-0 font-size-16"
                          size="md"
                          style={{ width: "200px", height: "40px" }}
                        >
                          Up this post for 0.1 ETH
                        </Button>
                      </div>
                    )}
                  </Card.Footer>
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
