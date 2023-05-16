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
import Details from "./componetns/Details";
import Sidebar from "./componetns/Sidebar";
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
        className="nav"
        float="top"
        style={{
          padding: "0px",
          marginLeft: "400px",
          position: "fixed",
          backgroundColor: "#fff",
          marginTop: "10px",
          marginRight: "100px",
          borderRadius: "10px",
          width: "1050px",
        }}
      >
        <Container style={{ padding: "0px", margin: "0px" }}>
          <img src={logo} alt="" style={{ paddingLeft: "20px" }} />
          <h3 style={{ paddingLeft: "20px", color: "#3808f5" }}>
            WISTLEBLOWER
          </h3>

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              {account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4"
                
                  style={{ paddingLeft: "400px" ,width:"200px", backgroundColor:"transparent"}}
                >
                  <Button
                    variant="outline-light"
                    style={{
                      padding: "0px",
                      margin: "0px",
                      borderRadius: "10px",
                      backgroundColor: "#3808f5",
                      width:"200px"
                    }}
                  >
                    {account.slice(0, 5) + "..." + account.slice(38, 42)}
                  </Button>
                </Nav.Link>
              ) : (
                <div style={{ paddingLeft: "400px" }}>
                  <Button
                    onClick={web3Handler}
                    variant="outline-light"
                    style={{
                      padding: "0px",
                      margin: "0px",
                      borderRadius: "10px",
                      backgroundColor: "#3808f5",
                    }}
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Sidebar>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#3808f5",
            }}
          >
            <Spinner
              animation="border"
              style={{ display: "flex", color: "#fff" }}
            />
            <p className="mx-3 my-0" style={{ color: "#fff" }}>
              Awaiting Metamask Connection...
            </p>
           
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
          </Routes>
        )}
      </Sidebar>
    </BrowserRouter>
  );
}

export default App;
