import React, { useState, useContext, useEffect } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBIcon, MDBBadge} from "mdbreact";
import { AuthContext } from "../context/AuthContext";
import { useHistory, NavLink, Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import {ChangeThemeModal} from './profile/ChangeThemeModal';

export const NavBar = ({setTheme}) => {

const auth = useContext(AuthContext)
const [navToggle, setNavToggle] = useState(false);
const [user, setUser] = useState(null);
const [themeModalState, setThemeModalState] = useState(false);
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
        setTheme(data.user.themeName);
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

const applyTheme = (theme) => {

    setTheme(theme);
    setThemeModalState(false);
}

  return (
    <div style={{marginBottom: "10px"}}>
        <MDBContainer>
        
        {user && 
        <MDBNavbar color="light-blue darken-1" dark expand="md" style={{ marginTop: "20px" }}>
            <MDBNavbarBrand>
            <strong className="white-text"> T<i style={{fontSize: "18px"}} className="far fa-grin-wink"/> Records</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={navToggleHandler} />
            <MDBCollapse id="navbarCollapse3" isOpen={navToggle} navbar>
            <MDBNavbarNav left>
                <MDBNavItem>
                    <MDBNavLink to="/notepads">
                        Notepads 
                        {/* <span data-test="badge" class="badge badge-header ml-1">4</span> */}
                    </MDBNavLink>
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
                            
                            <div className="user-mini-photo" 
                                style={{backgroundImage: `url(/${user.photo})`}}></div>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default custom-drop-menu" right>

                            <MDBDropdownItem><Link to="/profile"><i className="far fa-user-circle"/> My account</Link></MDBDropdownItem>
                            <button className="dropdown-item" onClick={() => {setThemeModalState(true)}}><i className="fas fa-palette"/> Change theme</button>
                            <button className="dropdown-item" onClick={logoutHandler}><i className="fas fa-sign-out-alt"/> Log out</button>

                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
            </MDBCollapse>
        </MDBNavbar>}

        {user && <ChangeThemeModal onApply={applyTheme} modalState={themeModalState}
            onCancel={() => {setThemeModalState(false)}} user={user}/>}
        </MDBContainer>
    </div>
    );
  
}