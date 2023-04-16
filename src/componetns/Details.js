import React from "react";
import "./Details.css";
export default function Details(params) {
  return (
    <div className="container-box">
      <h1>Incident Report</h1>
      <div className="row">
        <div className="box" style={{ width: "750px" }}>
          {" "}
          <p className="top" style={{ color: "gray" }}>
            Organization:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.organization}
          </p>
        </div>
        <div className="box" style={{ width: "500px" }}>
          <p className="top" style={{ color: "gray" }}>
            Organization ID:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.orgid}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="box" style={{ width: "350px" }}>
          <p className="top" style={{ color: "gray" }}>
            Location:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.location}
          </p>
        </div>{" "}
        <div className="box" style={{ width: "350px" }}>
          <p className="top" style={{ color: "gray" }}>
            Encounter:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.encounter}
          </p>
        </div>
        <div className="box" style={{ width: "500px" }}>
          <p className="top" style={{ color: "gray" }}>
            Relationship:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.relation}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="box" style={{ width: "1400px" }}>
          {" "}
          <p className="top" style={{ color: "gray" }}>
            Category:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.category}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="box" style={{ width: "800px" }}>
          {" "}
          <p className="top" style={{ color: "gray" }}>
            Department:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.department}
          </p>
        </div>
        <div className="box" style={{ width: "400px" }}>
          {" "}
          <p className="top" style={{ color: "gray" }}>
            Period:
          </p>
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.period}
          </p>
        </div>
      </div>
      <div className="row">
        {" "}
        <p style={{ color: "gray" }}>Incident information</p>
        <div className="box" style={{ width: "1400px", height: "100%" }}>
          {" "}
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.incident}
          </p>
        </div>
      </div>
      <div className="row">
        {" "}
        <p style={{ color: "gray" }}>Disciplinary action requested</p>
        <div className="box" style={{ width: "1400px", height: "100%" }}>
          {" "}
          <p className="top" style={{ paddingLeft: "4px" }}>
            {params.content.suggestion}
          </p>
        </div>
      </div>
      <img src={params.content.proof} style={{height:"400px", width:"400px", paddingTop:"80px", borderRadius:"10px"}}></img>
    </div>
  );
}
