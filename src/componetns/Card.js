import React from "react";
import url from "../assets/p1.png";
function Card(props) {
  return (
    <div className="card">
      <div className="image">
        
        <img src={url} className="card--image"></img>
      </div>

      <h3 className="title">{props.title}</h3>
      <p >{props.description} </p>
    </div>
  );
}

export default Card;
