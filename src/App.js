import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import DecentratwitterAbi from "./contractsData/decentratwitter.json";
import DecentratwitterAddress from "./contractsData/decentratwitter-address.json";
import { Spinner, Navbar, Nav, Button, Container } from "react-bootstrap";
import logo from "./assets/whistle.png";
import Home from "./Home.js";
import Profile from "./Profile.js";
import Onboarding from "./componetns/Onboarding";
import "./App.css";
import Report from "./container/Report";
import DashBoard from "./container/DashBoard";
import Sidebar from "./componetns/Sidebar";
import About from "./componetns/About";
import { BallTriangle } from "react-loader-spinner";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState({});

  const web3Handler = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    // Setup event listeners for metamask
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
    window.ethereum.on("accountsChanged", async () => {
      setLoading(true);
      web3Handler();
    });
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get signer
    const signer = provider.getSigner();
    loadContract(signer);
  };
  const loadContract = async (signer) => {
    // Get deployed copy of Decentratwitter contract
    const contract = new ethers.Contract(
      DecentratwitterAddress.address,
      DecentratwitterAbi.abi,
      signer
    );
    setContract(contract);
    setLoading(false);
  };
  return (
    <BrowserRouter>
      <Navbar
        expand="lg"       

        style={{
          display: "flex",
          backgroundColor:"#fff",
          width:"100vw",
          alignItems: "center",
          justifyContent:'space-between'
        }}
        className="nav"
        float="top"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {" "}
          <img src={logo} alt="" style={{ paddingLeft: "20px" }} />
          <h3
            style={{ paddingTop: "20px", paddingLeft: "20px", color: "#000" }}
            className="logo"
          >
            WHISTLER
          </h3>
        </div>
        <Navbar.Collapse id="responsive-navbar-nav" style={{display: "flex",justifyContent:'right', paddingRight:"40px", margin:'0px'}}>
          <Nav>
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button nav-button btn-sm mx-4"
                style={{
                  width: "250px",
                  backgroundColor: "transparent",
                }}
              >
                <Button
                  variant="outline-light"
                  style={{
                    padding: "0px",
                    margin: "0",
                    borderRadius: "10px",
                    backgroundColor: "black",
                    width: "200px",
                  }}
                  className="btn"
                >
                  {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <div>
                <Button
                  onClick={web3Handler}
                  variant="outline-light"
                  style={{
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "10px",
                    backgroundColor: "#000",
                  }}
                  className="btn"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Sidebar>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              height: "100vh",
              backgroundColor: "#ffff",
            }}
          >
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#000"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle=""
              visible={true}
            />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/post" element={<Home contract={contract} />} />
            <Route path="/report" element={<Report contract={contract} />} />
            <Route
              path="/dashboard"
              element={<DashBoard contract={contract} />}
            />
            <Route path="/profile" element={<Profile contract={contract} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        )}
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
