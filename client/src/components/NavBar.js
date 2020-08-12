import React, { useState, useContext } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBIcon} from "mdbreact";
import { AuthContext } from "../context/AuthContext";
import { useHistory, NavLink } from "react-router-dom";

export const NavBar = () => {

const auth = useContext(AuthContext)
const [navToggle, setNavToggle] = useState(false);
const history = useHistory();

const logoutHandler = event =>{

    event.preventDefault();

    auth.logout();
    history.push('/');
}

const navToggleHandler = () => {
    setNavToggle(!navToggle);
}

  return (
    <div style={{marginBottom: "10px"}}>
        <MDBContainer>
        
        <MDBNavbar color="light-blue darken-1" dark expand="md" style={{ marginTop: "20px" }}>
            <MDBNavbarBrand>
            <strong className="white-text">To Links</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={navToggleHandler} />
            <MDBCollapse id="navbarCollapse3" isOpen={navToggle} navbar>
            <MDBNavbarNav left>
                {/* <NavLink activeStyle={{backgroundColor: "#ffffff1a"}} to="/home">Home</NavLink>
                <NavLink activeStyle={{backgroundColor: "#ffffff1a"}} to="/available">Available to me</NavLink> */}
                <MDBNavItem>
                    <MDBNavLink to="/home">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="/available">Available to me</MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light d-flex align-items-center" to="#!">1
                    <MDBIcon icon="envelope" className="ml-1" />
                </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle className="dopdown-toggle" nav>
                    <img src="https://tanzolymp.com/images/default-non-user-no-photo-1.jpg" className="rounded-circle z-depth-0"
                        style={{ height: "35px", padding: 0 }} alt="" />
                    </MDBDropdownToggle>
                    <MDBDropdownMenu className="dropdown-default" right>
                    <MDBDropdownItem href="#!">My account</MDBDropdownItem>
                    <MDBDropdownItem href="#!" onClick={logoutHandler}>Log out</MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
            </MDBCollapse>
        </MDBNavbar>
        </MDBContainer>
    </div>
    );
  
}