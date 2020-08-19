
import React, { useState, useContext } from "react";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { SelectImage } from '../SelectImage';
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";

export const ChangeThemeModal = ({modalState, onApply, onCancel, user}) => {

    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [selectedImage, setSelectedImage] = useState();
    const [loading, setLoading] = useState(false);

    const applyTheme = async () => {

        try {
            setLoading(true);

            user.themeName = selectedImage;
            const data = await request('/api/profile/save-profile', "POST", {user}, 
                {Authorization: `Bearer ${auth.token}`});
            
            onApply();
            setLoading(false);

        } catch (error) {

            setLoading(false);
        }
    }

    return (
      <MDBContainer>
        
        <MDBModal isOpen={modalState} centered>
          <MDBModalHeader >Select theme</MDBModalHeader>
          <MDBModalBody>

            <SelectImage imagesType="themes" selectedImage={user.themeName} isFullScreen={true}
                imageChange={(image) => {setSelectedImage(image)}} />

          </MDBModalBody>
          <MDBModalFooter>
            <button className="btn btn-danger" disabled={loading} onClick={onCancel}><i className="fas fa-times"/> Cancel</button>
            <button className="btn btn-success" disabled={loading} onClick={applyTheme}><i className="fas fa-check"/> Apply</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
}