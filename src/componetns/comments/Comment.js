import "./Comment.css";
import { useState, useEffect } from "react";

import React from "react";

function Comment({ params }) {
  const comments = [
    {
      id: 1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
      name: "John Doe",
      userId: 1,
      profilePicture:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 2,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
      name: "Jane Doe",
      userId: 2,
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
  ];
  const [comment, setComment] = useState("");

  const loadComments = async () => {
    console.log('eee')
    let res = await params.contract.viewComment(params.postid);
    console.log(res)
  };
  const uploadComment = async () => {
    console.log(comment);
    await (
      await params.contract.postComment(params.postid, comment, params.userid)
    ).wait();
    loadComments();
  };

  return (
    <div className="comments">
      <div className="write">
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={uploadComment}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment">
          <img className="im" src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">1 hour ago</span>
        </div>
      ))}
    </div>
  );
}

export default Comment;
