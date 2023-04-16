import { useState, useEffect } from "react";

import axios from "axios";
import { Row, Form, Button, Card, ListGroup, Col } from "react-bootstrap";


const App = ({ contract }) => {
  const [profile, setProfile] = useState("");
  const [nfts, setNfts] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const apiKey = "0a245a6e2144d20c5710";
  const apiSecret =
    "fbd8aaf8b0bf36829293b2e28ccd709ac796b8ff152d375eb3a6035d03196c5f";
  const loadMyNFTs = async () => {
    // Get users nft ids
    const results = await contract.getMyNfts();
    // Fetch metadata of each nft and add that to nft object.
    let nfts = await Promise.all(
      results.map(async (i) => {
        // get uri url of nft
        const uri = await contract.tokenURI(i);
        // fetch nft metadata

        const response = await fetch(uri,);
       console.log(response)
        const m = await response.json();
        const metadata = await JSON.parse(m);
        console.log(metadata)

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
      <div className="text-center">
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      </div>
    );
  return (
    <div className="mt-4 text-center">
      {profile ? (
        <div className="mb-3">
          <img
            className="mb-3"
            style={{ width: "200px", height: "200px", borderRadius: "10px" }}
            src={profile.avatar}
          />
          <h3 className="mb-3">{profile.username}</h3>
        </div>
      ) : (
        <h4 className="mb-4">No NFT profile, please create one...</h4>
      )}

      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Username"
              />
              <div className="d-grid px-0" style={{borderRadius:"10px" }}>
                <Button
                  onClick={mintProfile}
                  variant="primary"
                  size="lg"
                  style={{ backgroundColor: "#3808f5", borderRadius:"10px" }}
                >
                  Mint NFT Profile
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {nfts.map((nft, idx) => {
            if (nft.id === profile.id) return;
            return (
              <Col key={idx} className="overflow-hidden">
                <Card style={{ width: "220px",
                height: "345px",
                borderRadius: "10px",}}>
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
