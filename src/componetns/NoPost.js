import React from "react";
import url from "../assets/4.png";
import { motion } from "framer-motion";

function NoPost() {
  return (
  
    <div
      className="onboarding"
      style={{
        marginLeft: "300px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "520px",
      }}
    >
      <div className="hero">
        <div className="text--area">
          <h1>You must own an NFT to continue</h1>
        </div>
        
        <div className="j">
          {" "}
          <img
            src={url}
            className="hero--img"
            style={{ width: "400px", zIndex: "-1", color: "#fff", paddingLeft:"30px" }}
          ></img>
        </div>
        
      </div>
    </div>
  );
}

export default NoPost;
