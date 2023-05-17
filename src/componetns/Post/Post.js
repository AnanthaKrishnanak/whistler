
import {
  FaHome,
  FaRegCommentAlt,
  FaRegEdit,
  FaRegClone,
  FaRegUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  //TEMPORARY
  const liked = false;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">1 min ago</span>
            </div>
          </div>
          <FaHome />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {liked ? <FaHome /> : <FaHome />}
            12 Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <FaHome />
            12 Comments
          </div>
          <div className="item">
            <FaHome />
            Share
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default Post;