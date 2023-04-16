import React from "react";
import url from "../assets/undraw_ether_re_y7ft.svg";
import "./Nopost.css";
function NoPost() {
  return (
    <div className="nopost">
      <div className="text-box">
        <h1>You must own an <span>NFT</span> to continue</h1>
        <p>
          You must create a NFT profile to continue using the services. You can
          create your NFT profile from the profile section.
        </p>
      </div>
      <img src={url}></img>
    </div>
  );
}

export default NoPost;
