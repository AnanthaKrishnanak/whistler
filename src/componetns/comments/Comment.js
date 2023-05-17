import "./Comment.css";
import { useState, useEffect } from "react";
import im from "../../assets/account.png";
import React from "react";

function Comment({ params }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const loadComments = async () => {
    console.log("eee");
    let res = await params.contract.viewComment(params.postid);
    var commentsArray = [];
    res.map(mapComment);

    function mapComment(e) {
      const obj = JSON.parse(e.commentContent);

      commentsArray.push({
        id: e[0],
        desc: obj.content,
        name: e[1],
        time: obj.time,
      });
    }
    setComments(commentsArray);
  };
  loadComments();
  const uploadComment = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;

    var data = { content: comment, time: today };
    const commentData = JSON.stringify(data);

    await (
      await params.contract.postComment(
        params.postid,
        commentData,
        params.userid
      )
    ).wait();
    loadComments();
  };

  return (
    <div className="comments">
      <div className="write">
        <input
          type="text"
          placeholder="Write a comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={uploadComment}    style={{
          backgroundColor: "#000",
          width: "100px",
          borderRadius: "5px",
         }}>
          Send
        </button>
      </div>
      {comments.map((comment) => (
        <div className="comment">
          <img className="im" src={im} alt="" />
          <div className="inf">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">posted on {comment.time}</span>
        </div>
      ))}
    </div>
  );
}

export default Comment;
