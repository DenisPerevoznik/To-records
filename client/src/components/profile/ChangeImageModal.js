import React, { useContext, useState } from 'react';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'

export const ChangeImageModal = ({modalState = false, onCancel}) => {

    const {request} = useHttp();
    const auth = useContext(AuthContext);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const savePhoto = async (event) => {

        try {
            
            const formData = new FormData();
            formData.append("userId", auth.userId);
            formData.append("user-photo", selectedPhoto);

            axios.post('/api/profile/upload-photo', formData, {headers: {Authorization: `Bearer ${auth.token}`}})
                .then(res => {console.log("response: ", res)});

        } catch (error) {
            console.log("status: ", error.message);
        }
    }

    const changePhotoHandler = (event) => {

        setSelectedPhoto(event.target.files[0]);
        console.log(event.target.files[0]);
    }

    return (
        <MDBModal isOpen={modalState} centered>
            <MDBModalHeader>
                Change image profile
            </MDBModalHeader>

            <MDBModalBody>

            
            <label>Select image:</label>
            <input type="file" name="user-photo" onChange={changePhotoHandler}/>

            </MDBModalBody>
            <MDBModalFooter>

                <button className="btn btn-danger" onClick={onCancel}><i className="fas fa-times"/> Cancel</button>
                <button className="btn btn-success" onClick={savePhoto}><i className="fas fa-check"/> Save</button>
            </MDBModalFooter>
        </MDBModal>
    )
}