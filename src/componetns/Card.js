import React from "react";
import url from "../assets/p1.png";import { motion } from "framer-motion";

function Card(props) {
  return (
    <motion.div
    whileInView={{ x: [-100, 0], opacity: [0, 1] }}
    transition={{ duration: 1, ease: "easeInOut" }}
  >
    <div className="card">
      <div className="image"  style={{backgroundColor:"#000"}}>
        
        <img src={url} className="card--image"></img>
      </div>

      <h3 className="title" style={{margin:"0px"}}>{props.title}</h3>
      <p >{props.description} </p>
    </div>
    </motion.div>
  );
}

export default Card;
