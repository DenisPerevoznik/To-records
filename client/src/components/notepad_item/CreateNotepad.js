import React, { useState, useContext, useEffect } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import { AuthContext } from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import {useHttp} from '../../hooks/http.hook';
import { SelectBackground } from './SelectBackground';

export const CreateNotepad = ({updateElementsMethod}) => {

    const auth = useContext(AuthContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
      image: {},
      name: "",
      description: ""
    });
    const {addToast} = useToasts();
    const {request} = useHttp();

    const createHandler = async (event) => {
      
      event.preventDefault();
      try {

        const data = await request('/api/notepad/create', "POST", form, {Authorization: `Bearer ${auth.token}`});
        
        addToast(data.message, {appearance: "success", autoDismiss: true});
        setModalOpen(false);
        
        updateElementsMethod();
        setForm({name: "", description: ""});
      } catch (error) {
        
        addToast(error.message, {appearance: "error", autoDismiss: true});
        
      }
    }

    const onChangeHandler = (event) => {

      setForm({...form, [event.target.name]: event.target.value});
    }

    const imageChange = (image) => {

      setForm({...form, image});
    }

    return (
    <MDBContainer>
        <MDBBtn gradient="aqua" onClick={() => {setModalOpen(!modalOpen)}}>
            <i className="fa fa-plus"/> Create notepad</MDBBtn>
        <MDBModal isOpen={modalOpen} toggle={() => {setModalOpen(!modalOpen)}} centered>
          <MDBModalHeader toggle={() => {setModalOpen(!modalOpen)}}>Create new notepad</MDBModalHeader>
          <MDBModalBody>

            <label>Select image:</label>
            <SelectBackground imageChange={imageChange}/>

            <MDBInput type="text" label="Notepad name" value={form.name} name="name" onChange={onChangeHandler}/>
            
            <MDBInput type="textarea" value={form.description} label="Description" onChange={onChangeHandler} name="description" maxLength="60"/>

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="dark" onClick={() => {setModalOpen(!modalOpen)}}>Cancel</MDBBtn>
            <MDBBtn color="default" onClick={createHandler}>Create</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
    </MDBContainer>
    );
}
