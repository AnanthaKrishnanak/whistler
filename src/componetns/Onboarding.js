import React from "react";

import url from "../assets/2.png";

function Onboarding() {
  return (
    <div className="onboarding">
      <div className="hero">
        <div className="text--area">
          <h1>We bring your voices out to help the world</h1>
        </div>
        <div className="j">
          {" "}
          <img
            src={url}
            className="hero--img"
            style={{ width: "500px", zIndex: "-1" }}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
