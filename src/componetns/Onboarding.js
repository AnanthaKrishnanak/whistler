import React from "react";

import url from "../assets/2.jpg";
import { motion } from "framer-motion";

function Onboarding() {
  return (
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
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
              style={{ width: "500px", zIndex: "-1", color: "#fff" }}
            ></img>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Onboarding;
