
import React, { useState, useContext } from "react";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { SelectImage } from '../SelectImage';
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";

export const ChangeThemeModal = ({modalState, onApply, onCancel, user}) => {

    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [selectedTheme, setSelectedTheme] = useState();
    const [loading, setLoading] = useState(false);

    const applyTheme = async (isReset) => {

        try {
            setLoading(true);

            user.themeName = isReset ? "none" : selectedTheme;
            const data = await request('/api/profile/save-profile', "POST", {user}, 
                {Authorization: `Bearer ${auth.token}`});
            
            onApply(isReset ? "none" : selectedTheme);
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
                imageChange={(image) => {setSelectedTheme(image)}} />

          </MDBModalBody>
          <MDBModalFooter>
            <button onClick={() => {applyTheme(true)}} className="btn btn-primary"><i className="fas fa-ban"/> Reset theme</button>
            <button className="btn btn-danger" disabled={loading} onClick={onCancel}><i className="fas fa-times"/> Cancel</button>
            <button className="btn btn-success" disabled={loading} onClick={() => {applyTheme(false)}}><i className="fas fa-check"/> Apply</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
}