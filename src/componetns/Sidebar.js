import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import '../index.css'

import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineUser,
  HiOutlineSquares2X2,
  HiOutlinePaperAirplane,HiOutlineDocumentArrowUp
} from "react-icons/hi2";
const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: <HiOutlineHome />,
    },
    {
      path: "/post",
      name: "Post",
      icon: <HiOutlinePaperAirplane />,
    },
    {
      path: "/report",
      name: "Report",
      icon: <HiOutlineDocumentArrowUp />,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <HiOutlineSquares2X2 />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <HiOutlineUser />,
    },
    {
      path: "/about",
      name: "About",
      icon: <HiOutlineInformationCircle />,
    },
  ];
  return (
    <div className="page">
      <div className="sidebar" style={{ backgroundColor: "#fff" }}>
        <div className="top_section">
          <h3 style={{ paddingTop: "20px" }} className="logo">WHISTLER</h3>
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
