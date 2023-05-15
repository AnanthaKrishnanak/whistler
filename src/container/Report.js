import React from "react";
import { Row, Form, Button, Card, ListGroup, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./Report.css";
import axios from "axios";
function Report({ contract }) {
  const [hasProfile, setHasProfile] = useState(false);
  const [report, setReport] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("");
  const [relation, setRelation] = useState("");
  const [encounter, setEncounter] = useState("");
  const [department, setDapartment] = useState("");
  const [location, setLocation] = useState("");
  const [orgid, setOrgid] = useState("");
  const [period, setPeriod] = useState("");
  const [incident, setIncident] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = "fd8bff84becd3aba34f7";
  const apiSecret =
    "ff71dd4a580f61ba90b921a058be513e5d0262aaeac7b3f7105f142fe0fa5214";
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
          headers: {'Access-Control-Allow-Origin': '*' , "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        setProof(ImgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const uploadReportToIPFS = async (event) => {
    setLoading(true);
    try {
      const myJSON = {
        organization: organization,
        category: category,
        relation: relation,
        encounter: encounter,
        department: department,
        location: location,
        orgid: orgid,
        period: period,
        incident: incident,
        suggestion: suggestion,
        proof: proof,
      };
      const jsonString = JSON.stringify(myJSON);
      console.log(myJSON);

      const apiUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const headers = {'Access-Control-Allow-Origin': '*' , "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      };

      const data = {
        pinataContent: jsonString,
      };
      console.log(jsonString);

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
      window.alert("ipfs uri upload error: ", error);
    }
    setLoading(false);
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
    <div className="row report">
      <main
        role="main"
        className="col-lg-12 mx-auto"
        style={{ maxWidth: "1000px" }}
      >
        {" "}
        <h1 style={{ marginBottom: "30px" }}>Want to speak up for an issue?</h1>
        <div className="content mx-auto">
          <Row className="g-4 form">
            <span>Organization</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setOrganization(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Category</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setCategory(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Relationship</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setRelation(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Encounter</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setEncounter(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Department</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setDapartment(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Location</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setLocation(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Organization ID</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setOrgid(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Period</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setPeriod(e.target.value)}
              size="lg"
              required
              type="text"
            />
            <span>Incident information</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setIncident(e.target.value)}
              size="lg"
              required
              type="text"
              as="textarea"
            />
            <span>Disciplinary action requested</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setSuggestion(e.target.value)}
              size="lg"
              required
              type="text"
              as="textarea"
            />
            <span>Proof</span>

            <Form.Control
              id="form-control"
              type="file"
              required
              name="file"
              style={{ marginBottom: "50px" }}
              onChange={uploadToIPFS}
            />
            <div className="d-grid px-0" style={{ borderRadius: "10px" }}>
              <Button
                onClick={uploadReportToIPFS}
                variant="primary"
                size="lg"
                style={{
                  backgroundColor: "#3808f5",
                  borderRadius: "10px",
                }}
              >
                Report issue
              </Button>
            </div>
          </Row>
        </div>
        <div style={{ height: "100px" }}></div>
      </main>
    </div>
  );
}

export default Report;
