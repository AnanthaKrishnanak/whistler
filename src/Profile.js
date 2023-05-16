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
  MDBIcon,
  MDBCheckbox,
} from "mdb-react-ui-kit";

import axios from "axios";
import { Row, Form, Button, Card, ListGroup, Col } from "react-bootstrap";
import { apiKey, apiSecret } from "./constants/constants";
import "./index.css";
import image from "./assets/profile.jpg";

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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
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
      <div className="text-center">
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      </div>
    );
  return (
    <div className="mt-4 text-center">
      {profile ? (
        <div
          className="mb-3"
          style={{
            backgroundColor: "#ffff",
            borderRadius: "25px",
            marginLeft: "360px",
            marginRight: "30px",
            marginTop: "120px",
            height: "320px",
            boxShadow: " 0px 0px 25px -10px rgba(0, 0, 0, 0.38)",
          }}
        >
          <p
            style={{
              paddingRight: "950px",
              paddingTop: "30px",
              fontSize: "25px",
            }}
          >
            Profile
          </p>
     
            <img
              className="mb-3"
              style={{ width: "180px", height: "150", borderRadius: "50%" }}
              src={profile.avatar}
            />
            <h3 className="mb-3">{profile.username}</h3>
        
        </div>
      ) : (
        <h1>Please create a profile</h1>
      )}
      <div style={{ width: "900px", marginLeft: "300px" }}>
        <MDBContainer fluid>
          <MDBCard
            className="text-black m-5"
            style={{
              borderRadius: "25px",
              width: "1100px",
              height: "550px",
              margin: "0px",
              backgroundColor: "#fff",
              boxShadow: " 0px 0px 25px -10px rgba(0, 0, 0, 0.38)",
            }}
          >
            <MDBCardBody>
              <MDBRow>
                <MDBCol
                  md="10"
                  lg="6"
                  className="order-2 order-lg-1 d-flex flex-column align-items-center"
                >
                  <p
                    classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"
                    style={{ fontSize: "40px" }}
                  >
                    Create Profile
                  </p>
                  <div className="row">
                    <main role="main" className="col-lg-12 mx-auto">
                      <p style={{ paddingRight: "400px" }}>User name:</p>

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

                      <div
                        className="d-grid px-0"
                        style={{ borderRadius: "10px" }}
                      >
                        <Button
                          onClick={mintProfile}
                          variant="primary"
                          size="lg"
                          style={{
                            backgroundColor: "#3808f5",
                            borderRadius: "10px",
                            width: "400px",
                            padding: "0px",
                            margin: "0px",
                          }}
                        >
                          Mint NFT Profile
                        </Button>
                      </div>
                    </main>
                  </div>
                </MDBCol>

                <MDBCol
                  md="10"
                  lg="6"
                  className="order-1 order-lg-2 d-flex align-items-center"
                >
                  <MDBCardImage
                    src="https://img.freepik.com/premium-vector/powerful-ai-technology-background_42859-383.jpg?w=740"
                    fluid
                    style={{
                      width: "550px",
                      height: "450px",
                      borderRadius: "30px",
                    }}
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>

      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {nfts.map((nft, idx) => {
            if (nft.id === profile.id) return;
            return (
              <Col key={idx} className="overflow-hidden">
                <Card
                  style={{
                    width: "220px",
                    height: "345px",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={nft.avatar}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "10px",
                    }}
                  />
                  <Card.Body color="secondary">
                    <Card.Title>{nft.username}</Card.Title>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button
                        onClick={() => switchProfile(nft)}
                        variant="primary"
                        size="lg"
                        style={{
                          backgroundColor: "#3808f5",
                          color: "#fff",
                          borderRadius: "10px",
                        }}
                      >
                        Set as Profile
                      </Button>
                    </div>
                  </Card.Footer>
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
