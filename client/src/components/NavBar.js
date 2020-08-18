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

    if(auth.userId)
        getUser();
}, [auth]);

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
            <strong className="white-text"> T<i style={{fontSize: "18px"}} className="far fa-grin-wink"/> Records</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={navToggleHandler} />
            <MDBCollapse id="navbarCollapse3" isOpen={navToggle} navbar>
            <MDBNavbarNav left>
                <MDBNavItem>
                    <MDBNavLink to="/notepads">Notepads</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="/available">Available to me</MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light d-flex align-items-center" to="#!">
                    {/* <MDBIcon icon="search" className="ml-1" />
                    <input className="form-control form-control-sm ml-3 w-100" 
                                    type="text" placeholder="Search" aria-label="Search" /> */}

                        <i className="fas fa-bell"/> 1
                </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle className="dopdown-toggle" style={{padding: "0.3rem 1rem"}} nav>
                    {user ?
                    // <img src={`/${user.photo}`} className="rounded-circle z-depth-0"
                    //     style={{ height: "35px", width: "35px" }} alt="" />
                    <div className="user-mini-photo" 
                        style={{backgroundImage: `url(/${user.photo})`}}></div>
                        :
                    <i className="fas fa-user-circle" style={{fontSize: "30px"}}/>}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu className="dropdown-default custom-drop-menu" right>

                        <MDBDropdownItem><Link to="/profile"><i className="far fa-user-circle"/> My account</Link></MDBDropdownItem>
                        <button className="dropdown-item" onClick={logoutHandler}><i className="fas fa-sign-out-alt"/> Log out</button>

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