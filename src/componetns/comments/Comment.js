import "./Comment.css";
import { useState, useEffect } from "react";

const Comments = (contract) => {
  //Temporary
  const [comment, setComment] = useState("");

  const loadComments = async () => {
    // Get user's address
    console.log('sdddddddddddddd')
    let res = await contract.viewComment();
    console.log(res)

    // Fetch metadata of each post and add that to post object.
  };
  const uploadComment = async () => {
    await (await contract.postComment("test", '0x2546bcd3c84621e976d8185a91a922ae77ecec30')).wait();
    loadComments();
  };

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
};

export default Comments;
