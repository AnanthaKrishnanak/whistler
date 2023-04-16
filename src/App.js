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
      <div className="App">
        <>
          <Navbar expand="lg" className="nav" float="top">
            <Container>
              <Navbar.Brand>
                <img src={logo} alt="" />
                &nbsp;
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/" key={1} >
                    <span className="link">HOME</span>
                  </Nav.Link>

                  <Nav.Link as={Link} to="/posts" key={2}>
                    <span className="link">POST</span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/report" key={3}>
                    <span className="link">REPORT</span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dash" key={4}>
                    <span className="link">INVESTIGATE</span>
                  </Nav.Link>

                  <Nav.Link as={Link} to="/profile" key={5}>
                    <span className="link">PROFILE</span>
                  </Nav.Link>
                </Nav>
                <Nav>
                  {account ? (
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4"
                    >
                      <Button variant="outline-light">
                        {account.slice(0, 5) + "..." + account.slice(38, 42)}
                      </Button>
                    </Nav.Link>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">
                      Connect Wallet
                    </Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
        <div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
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
              <Route path="/" element={<Onboarding></Onboarding>} />
              <Route path="/posts" element={<Home contract={contract} />} />
              <Route
              path="/report"
              element={<Report contract={contract}/>}
            />
            <Route
            path="/dash"
            element={<DashBoard contract={contract}/>
            
          }
          />
              <Route
                path="/profile"
                element={<Profile contract={contract} />}
              /> <Route
              path="/details"
              element={<Details/>
              
            }
            />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
