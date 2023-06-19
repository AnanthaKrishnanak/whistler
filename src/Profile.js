import { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
} from "mdb-react-ui-kit";
import url from "./assets/3.png";
import { BallTriangle } from "react-loader-spinner";

import axios from "axios";
import { Row, Form, Button, Card, ListGroup, Col } from "react-bootstrap";
import { apiKey, apiSecret } from "./constants/constants";
import "./index.css";
import { motion } from "framer-motion";

const App = ({ contract }) => {
  const [profile, setProfile] = useState("");
  const [nfts, setNfts] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMyNFTs = async () => {
    // Get users nft ids
    const results = await contract.getMyNfts();
    // Fetch metadata of each nft and add that to nft object.
    let nfts = await Promise.all(
      results.map(async (i) => {
        // get uri url of nft
        const uri = await contract.tokenURI(i);
        // fetch nft metadata

        const response = await axios.get(uri);
        console.log(response.data);
        const metadata = await JSON.parse(response.data);
        console.log(metadata);

        return {
          id: i,
          username: metadata.user,
          avatar: metadata.image,
        };
      })
    );
    console.log(nfts);
    setNfts(nfts);
    getProfile(nfts);
  };
  const getProfile = async (nfts) => {
    const address = await contract.signer.getAddress();
    const id = await contract.profiles(address);
    const profile = nfts.find((i) => i.id.toString() === id.toString());
    setProfile(profile);
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

        setAvatar(ImgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const mintProfile = async (event) => {
    if (!avatar || !username) return;
    try {
      const myJSON = { user: username, image: avatar };
      const jsonString = JSON.stringify(myJSON);
      console.log(myJSON);

      const apiUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const headers = {
        "Content-Type": "application/json",
        
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      };

      const data = {
        pinataContent: jsonString,
      };

      var result = await axios
        .post(apiUrl, data, { headers })
        .then(async (response) => {
          console.log(
            `JSON string uploaded successfully. IPFS hash: ${response.data.IpfsHash}`
          );

          setLoading(true);
          await (
            await contract.mint(
              `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
            )
          ).wait();
        })
        .catch((error) => {
          console.error("Error uploading JSON string:", error.message);
        });

      loadMyNFTs();
    } catch (error) {
      window.alert("ipfs uri upload error: ", error);
    }
  };
  const switchProfile = async (nft) => {
    setLoading(true);
    await (await contract.setProfile(nft.id)).wait();
    getProfile(nfts);
  };
  useEffect(() => {
    if (!nfts) {
      loadMyNFTs();
    }
  });
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          height: "100vh",
          backgroundColor: "#ffff",
        }}
      >
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#000"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      </div>
    );
  return (
    
    <div className="mt-4">
      {profile ? (
        <div
          className="mb-3"
          style={{
            backgroundColor: "#000",
            borderRadius: "25px",
            marginLeft: "360px",
            marginRight: "30px",
            marginTop: "50px",
            height: "250",
            paddingLeft: "20px",
            boxShadow: " 0px 0px 25px -10px rgba(0, 0, 0, 0.38)",
            position: "relative",
          }}
        >
          <p
            style={{
              paddingTop: "30px",
              fontSize: "25px",
              color: "#fff",
            }}
          >
            Profile
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: "30px",
              paddingLeft: "50px",
              boxShadow: " 0px 0px 25px -10px rgba(0, 0, 0, 0.38)",
            }}
          >
            <img
              className="mb-3"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#ffff",
                position: "absolute",
                marginTop: "50px",
                marginRight: "30px",
              }}
              src={profile.avatar}
            />
            <h3
              style={{ color: "#ffff", marginLeft: "120px", fontSize: "25px" }}
            >
              {profile.username}
            </h3>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <motion.div
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div
          style={{ width: "900px", marginLeft: "300px", paddingTop: "20px" }}
        >
          <MDBContainer fluid>
            <MDBCard
              className="text-black m-5"
              style={{
                borderRadius: "25px",
                width: "1100px",
                height: "500px",
                margin: "0px",
                padding: "0px",
                backgroundColor: "#fff",
                boxShadow: " 0px 0px 25px -10px rgba(0, 0, 0, 0.38)",
              }}
            >
              <MDBCardBody>
                <MDBRow style={{ padding: "0px", paddingLeft: "30px" }}>
                  <MDBCol md="10" lg="6" className="">
                    <p style={{ fontSize: "40px" }}>Create Profile</p>

                    <p>User name:</p>

                    <div className="d-flex flex-row align-items-center mb-4">
                      <MDBInput
                        id="form2"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "400px", margin: "0px" }}
                      />
                    </div>
                    <p style={{ paddingRight: "380px" }}>Profile picture:</p>

                    <div className="d-flex flex-row align-items-center mb-4">
                      <MDBInput
                        id="form2"
                        type="file"
                        style={{ width: "400px", margin: "0px" }}
                        onChange={uploadToIPFS}
                      />
                    </div>

                    <Button
                      onClick={mintProfile}
                      style={{
                        backgroundColor: "black",
                        borderRadius: "10px",
                        width: "400px",
                        padding: "0px",
                        color: "#ffff",
                        margin: "0px",
                        fontWeight: "bold",
                        border: "none",
                        marginTop: "20px",
                      }}
                    >
                      Mint NFT Profile
                    </Button>
                  </MDBCol>

                  <MDBCol
                    md="10"
                    lg="6"
                    className="order-1 order-lg-2 d-flex align-items-center"
                  >
                    <div
                      style={{
                        width: "600px",
                        height: "450px",
                        borderRadius: "30px",
                        backgroundColor: "#000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={url}
                        style={{
                          color: "#fff",
                        }}
                      ></img>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBContainer>
        </div>
      </motion.div>
      <div className="" style={{ marginLeft: "320px", paddingLeft: "40px" }}>
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {nfts.map((nft, idx) => {
            if (nft.id === profile.id) return;
            return (
              <Col key={idx} className="overflow-hidden">
                <Card
                  style={{
                    width: "250px",
                    height: "345px",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={nft.avatar}
                    style={{
                      width: "180px",
                      height: "200px",
                      borderRadius: "10px",
                    }}
                  />
                  <Card.Body color="secondary">
                    <Card.Title>{nft.username}</Card.Title>
                  </Card.Body>

                  <Button
                    onClick={() => switchProfile(nft)}
                    style={{
                      backgroundColor: "black",
                      color: "#fff",
                      borderRadius: "10px",
                      width: "100px",
                      height: "40px",
                    }}
                  >
                    Set as Profile
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default App;
