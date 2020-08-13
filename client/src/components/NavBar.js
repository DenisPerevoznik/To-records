import React, { useState, useContext, useEffect } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBIcon} from "mdbreact";
import { AuthContext } from "../context/AuthContext";
import { useHistory, NavLink, Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";

export const NavBar = () => {

const auth = useContext(AuthContext)
const [navToggle, setNavToggle] = useState(false);
const [user, setUser] = useState(null);
const {request} = useHttp();
const history = useHistory();

useEffect(() => {
    getUser();
}, []);

const getUser = async () => {

    try {
        
        const data = await request(`/api/profile/get-user/${auth.userId}`, "GET", null, 
            {Authorization: `Bearer ${auth.token}`});

        setUser(data.user);
    } catch (error) {}
}

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
            <strong className="white-text">To Records</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={navToggleHandler} />
            <MDBCollapse id="navbarCollapse3" isOpen={navToggle} navbar>
            <MDBNavbarNav left>
                <MDBNavItem>
                    <MDBNavLink to="/home">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="/available">Available to me</MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light d-flex align-items-center" to="#!">
                    <MDBIcon icon="search" className="ml-1" />
                    <input className="form-control form-control-sm ml-3 w-100" 
                                    type="text" placeholder="Search" aria-label="Search" />
                </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle className="dopdown-toggle" nav>
                    <img src={require(`../resources/user-photos/${user ? user.photo : "default.jpg"}`)} className="rounded-circle z-depth-0"
                        style={{ height: "35px", padding: 0 }} alt="" />
                    </MDBDropdownToggle>
                    <MDBDropdownMenu className="dropdown-default" right>
                    <MDBDropdownItem>
                        <Link to="/profile">My account</Link></MDBDropdownItem>
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