import React from 'react'
import logo from "../assets/whistle.png"
import '../index.css'
function NavBar() {
  return (
    <nav className='nav'>
     <img src={logo} alt="logo"></img>
     <h2>WISHTLER</h2>
    </nav>
  )
}

export default NavBar