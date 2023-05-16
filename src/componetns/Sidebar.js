import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaRegCommentAlt,
  FaRegEdit,
  FaRegClone,
  FaRegUser,
} from "react-icons/fa";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <FaHome />,
    },
    {
      path: "/post",
      name: "Post",
      icon: <FaRegCommentAlt />,
    },
    {
      path: "/report",
      name: "Report",
      icon: <FaRegEdit />,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaRegClone />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <FaRegUser />,
    },
  ];
  return (
    <div className="page">
      <div className="sidebar" style={{ backgroundColor: "#fff", }}>
        <div className="top_section">
          <h3 style={{paddingTop:"20px"}}>WHISTLER</h3>
          <hr className="line"></hr>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}
     
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
