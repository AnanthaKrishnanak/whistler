import React from "react";
import "./Details.css";
export default function Details(params) {
  return (
    <div className="container-box " style={{marginTop:"30px"}}>
      <h1>Incident Report</h1>
      <div className="box" style={{ width: "750px", paddingTop: "10px" }}>
        {" "}
        <p className="top" style={{ color: "gray" }}>
          Organization:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.organization}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        <p className="top" style={{ color: "gray" }}>
          Organization ID:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.orgid}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        <p className="top" style={{ color: "gray" }}>
          Location:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.location}
        </p>
      </div>{" "}
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        <p className="top" style={{ color: "gray" }}>
          Encounter:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.encounter}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        <p className="top" style={{ color: "gray" }}>
          Relationship:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.relation}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        {" "}
        <p className="top" style={{ color: "gray" }}>
          Category:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.category}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        {" "}
        <p className="top" style={{ color: "gray" }}>
          Department:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.department}
        </p>
      </div>
      <div className="box" style={{ width: "750px", marginTop: "15px" }}>
        {" "}
        <p className="top" style={{ color: "gray" }}>
          Period:
        </p>
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.period}
        </p>
      </div>{" "}
      <p style={{ color: "gray", marginTop: "15px" }}>Incident information</p>
      <div
        className="box"
        style={{ width: "750px", height: "100%", marginTop: "15px" }}
      >
        {" "}
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.incident}
        </p>
      </div>{" "}
      <p style={{ color: "gray", marginTop: "15px" }}>
        Disciplinary action requested
      </p>
      <div
        className="box"
        style={{ width: "750px", height: "100%", marginTop: "15px" }}
      >
        {" "}
        <p className="top" style={{ paddingLeft: "4px" }}>
          {params.content.suggestion}
        </p>
      </div>
      <p style={{ color: "gray", marginTop: "15px" }}>Proof</p>
      <img
        src={params.content.proof}
        style={{
          height: "400px",
          width: "400px",
          paddingTop: "20px",
          borderRadius: "10px",
        }}
      ></img>
    </div>
  );
}
