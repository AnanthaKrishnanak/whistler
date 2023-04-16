import React from "react";
import NavBar from "./NavBar";

import Info from "./Info";
import url from '../assets/2.png'
import Footer from "./Footer";

function Onboarding() {
  
  return (
    <div className="onboarding">
      <div className="hero">
        <div className="text--area">
          <h1>We bring
          your voices out
          to help the world</h1>
          <p>
            A secure and confidential platform empowers individuals to report
            wrongdoing, corruption, and unethical practices without fear of
            retaliation. Join us in promoting accountability and integrity in
            every sector, from corporate to government to nonprofit.
          </p>
        </div>
         <div className="j">  <img src={url} className="hero--img"></img></div>
      </div>
      <Info></Info>
      <Footer></Footer>
     
    </div>
  );
}

export default Onboarding;
