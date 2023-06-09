import React from "react";
import { Row, Form, Button, Card, ListGroup, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { apiKey, apiSecret } from "../constants/constants";
import "./Report.css";
import axios from "axios";import { BallTriangle } from "react-loader-spinner";
import { motion } from "framer-motion";

function Report({ contract }) {
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
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
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
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
    
    <div className=" report">
      <main style={{ width: "800px" }}>
        {" "}
        <h1 style={{ marginBottom: "30px" }}>Want to speak up for an issue?</h1>
        <motion.div
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="content mx-auto">
          <Row className="g-4 form">
            <span>Organization</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setOrganization(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
            />
            <span>Category</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setCategory(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
            />
            <span>Relationship</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setRelation(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
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
              className="input"
            />
            <span>Location</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setLocation(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
            />
            <span>Organization ID</span>
            <Form.Control
              id="form-control"
              onChange={(e) => setOrgid(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
            />
            <span>Period</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setPeriod(e.target.value)}
              size="lg"
              required
              type="text"
              className="input"
            />
            <span>Incident information</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setIncident(e.target.value)}
              size="lg"
              required
              type="text"
              as="textarea"
              className="input"
            />
            <span>Disciplinary action requested</span>

            <Form.Control
              id="form-control"
              onChange={(e) => setSuggestion(e.target.value)}
              size="lg"
              required
              type="text"
              as="textarea"
              className="input"
            />
            <span>Proof</span>

            <Form.Control
              id="form-control"
              type="file"
              required
              name="file"
              className="input"
              style={{ marginBottom: "50px" }}
              onChange={uploadToIPFS}
            />

            <Button
              onClick={uploadReportToIPFS}
              style={{
                backgroundColor: "black",
                border:"none",
                borderRadius: "10px",
              }}
            >
              Report issue
            </Button>
          </Row>
        </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Report;
