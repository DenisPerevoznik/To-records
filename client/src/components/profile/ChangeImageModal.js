import React, { useContext, useState, useEffect } from 'react';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBProgress } from 'mdbreact';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'
import { useToasts } from 'react-toast-notifications';

export const ChangeImageModal = ({modalState = false, closeModal, onPhotoUploaded}) => {

    const auth = useContext(AuthContext);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [progressLoaded, setProgressLoaded] = useState(0);
    const {addToast} = useToasts();

    useEffect(() => {

        if(progressLoaded == 100){
            setProgressLoaded(0);
            setSelectedPhoto(null);
            closeModal();
        }
    }, [progressLoaded])

    const close = () => {
        setSelectedPhoto(null);
        closeModal();
    }

    const savePhoto = async () => {

        const formData = new FormData();
            formData.append("userId", auth.userId);
            formData.append("user-photo", selectedPhoto);

            axios.post('/api/profile/upload-photo', formData, {
                headers: {Authorization: `Bearer ${auth.token}`},
                onUploadProgress: progressEvent => {
                    setProgressLoaded((progressEvent.loaded / progressEvent.total) * 100);
                } 
            })
                .then(res => {
                    addToast(res.data.message, {appearance: "success", autoDismiss: true});
                    onPhotoUploaded(res.data.userPhoto);
                })
                .catch((error) => {
                    addToast(error.response.data.message, {appearance: "error"});
                });
    }

    const changePhotoHandler = (event) => {

        setSelectedPhoto(event.target.files[0]);
    }

    return (
        <MDBModal isOpen={modalState} centered>
            <MDBModalHeader>
                Change image profile
            </MDBModalHeader>

            <MDBModalBody>

            <div className="d-flex flex-column">
                <label>Select image:</label>
                <input type="file" name="user-photo" onChange={changePhotoHandler}/>
                <MDBProgress value={progressLoaded} className="my-2" />
                
            </div>

            </MDBModalBody>
            <MDBModalFooter>

                <button className="btn btn-danger" onClick={close}><i className="fas fa-times"/> Cancel</button>
                <button className="btn btn-success" onClick={savePhoto} disabled={!selectedPhoto}>
                    <i className="fas fa-cloud-upload-alt"/> Upload</button>
            </MDBModalFooter>
        </MDBModal>
    )
}