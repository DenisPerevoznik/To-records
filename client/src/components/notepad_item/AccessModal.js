import React, { useState, useEffect } from 'react';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBBtn, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBTabPane, MDBTabContent, MDBTable, MDBTableBody, MDBTableHead, MDBTableFoot } from 'mdbreact';
import '../../resources/css/access-modal.css';
import { useHttp } from '../../hooks/http.hook';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';

export const AccessModal = ({notepad}) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("1");
    const [timer, setTimer] = useState(null);
    const [loadSearchUser, setLoadSearchUser] = useState(false);
    const [loadAccessUsers, setLoadAccessUsers] = useState(false);
    const [foundUser, setFoundUser] = useState(null);
    const [fastAccess, setFastAccess] = useState(false);
    const {request} = useHttp();
    const auth = useContext(AuthContext);
    const {addToast} = useToasts();
    const [accessUsers, setAccessUsers] = useState([]);

    useEffect(() => {

        updateAccessUsers();
    }, []);

    const changeEmailHandler = (event) => {

        const email = event.target.value;
        setFoundUser(null);

        clearTimeout(timer);
        setTimer(setTimeout(async () => {

            setLoadSearchUser(true);
        
            try {
                
                const data = await request('/api/notepad/get-user-by-email', "POST", {email, currentUserId: auth.userId}, 
                    {Authorization: `Bearer ${auth.token}`});

                setLoadSearchUser(false);
                setFoundUser(data.user);
                
                if(data.user != null){

                    const foundCurrentNotepad = data.user.availableNotepads
                        .find(idItem => idItem == notepad._id);

                    setFastAccess(foundCurrentNotepad ? true : false);
                }

            } catch (error) {
                addToast(error.message, {appearance: "error"});
            }
        }, 1500));
        
    }

    const openAccess = async () => {

        try {
            
            const data = await request('/api/notepad/open-access', "POST", {userId: foundUser._id, notepadId: notepad._id}, 
                {Authorization: `Bearer ${auth.token}`});

            closeModal();
            updateAccessUsers();
            addToast(data.message, {appearance: "success"});
        } catch (error) {
            
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    const generateAccessButton = () => {

        if(foundUser && fastAccess){
            return (
                <MDBBtn color="success" disabled>
                    <i className="fab fa-expeditedssl"/> Access granted</MDBBtn>
            );
        }
        else if (foundUser && !fastAccess){

            return (
                <MDBBtn color="success" onClick={openAccess}>
                    <i className="fab fa-expeditedssl"/> Open access for {foundUser.name}</MDBBtn>
            );
        }
        else{
            return (
                <MDBBtn color="success" disabled>
                    <i className="fab fa-expeditedssl"/> User not found</MDBBtn>
            );
        }
    }

    const closeModal = () => {

        setFoundUser(null);
        setModalOpen(false);
        setActiveTab("1");
    }

    const updateAccessUsers = async () => {

        try {
            setLoadAccessUsers(true);
            const data = await request(`/api/notepad/get-access-users/${notepad._id}`, "GET", null, 
                {Authorization: `Bearer ${auth.token}`});

            setLoadAccessUsers(false);
            setAccessUsers(data.users);
            
        } catch (error) {
            setLoadAccessUsers(false);
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    const removeAccess = async (userId) => {

        
        try {
            
            const data = await request(`/api/notepad/remove-access/${userId}/${notepad._id}`, 
                "GET", null, {Authorization: `Bearer ${auth.token}`});

            updateAccessUsers();
            addToast(data.message, {appearance: "info", autoDismiss: true});
        } catch (error) {
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    return (
        <>
        
        <a style={{color: "#009688", margin: "5px"}} onClick={() => {setModalOpen(true)}} title="Access" href="#"><i className="fas fa-users"></i></a>
            <MDBModal isOpen={modalOpen} toggle={closeModal} centered position="top">
                <MDBModalHeader toggle={closeModal}>Access control ({notepad.name})</MDBModalHeader>
                <MDBModalBody>

                    
                    <MDBNav tabs className="nav-justified" style={{fontSize: "18px"}} color="primary">
                        <MDBNavItem>
                            <MDBNavLink link to="#" onClick={() => {setActiveTab("1")}} 
                                className={activeTab == "1" ? "active" : ""} role="tab" >
                            <MDBIcon icon="unlock-alt" /> To open access
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink link to="#" onClick={() => {setActiveTab("2")}} 
                                className={activeTab == "2" ? "active" : ""} role="tab" >
                            <MDBIcon icon="list" /> Access list
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNav>
                    
                    <MDBTabContent style={{fontSize: "15px"}} className="p-4" activeItem={activeTab}>

                        <MDBTabPane tabId="1" role="tabpanel">
                            <div className="row">
                                <div className="col-12">
                                    <p>Enter the email of the person who will have access:</p>
                                    <input onChange={changeEmailHandler} type="email" className="form-control" placeholder="Email"/>
                                    {loadSearchUser && 
                                    
                                        <div className="spinner-border spinner-border-sm" 
                                            style={{color: "#18d3ca"}} role="status">
                                            <span className="sr-only">Saving...</span>
                                        </div>
                                    }

                                    <p><i className="fas fa-user-circle"/> {foundUser ? foundUser.name : "User is not found"}
                                        <span style={{color: fastAccess ? "green" : "red"}}>{foundUser ? (fastAccess ? " (Access granted)" : " (🔒 Without access) ") : ""}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex justify-content-end">

                                    {generateAccessButton()}
                                </div>
                            </div>
                        </MDBTabPane>
                        
                        
                        <MDBTabPane tabId="2" role="tabpanel">
                            <MDBTable hover className="custom-td">
                                <MDBTableHead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Control</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {loadAccessUsers ?
                                    <tr><td colSpan="3">
                                        <div className="spinner-border text-primary" 
                                             role="status">
                                            <span className="sr-only">Saving...</span>
                                        </div>
                                        </td></tr>
                                        :
                                        accessUsers.map((user) => <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td><MDBBtn color="danger" onClick={() => {removeAccess(user._id)}} size="sm">
                                                <i className="fas fa-lock"/> Remove access</MDBBtn></td>
                                        </tr>)}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBTabPane>

                    </MDBTabContent>

                </MDBModalBody>
            </MDBModal>
        </>
    );
}
