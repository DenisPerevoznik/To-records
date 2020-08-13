
import React, { useState } from "react";
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { SelectBackground } from './SelectBackground';

export const ChangeImageModal = ({changeImgMethod, currentImage}) => {

    const [modalOpen, setModalOpen] = useState(false);

    return (
      <MDBContainer>
        
        <a href="#" onClick={() => {setModalOpen(true)}}><i className="fas fa-pencil-alt"/> Change image</a>
        <MDBModal isOpen={modalOpen} toggle={() => {setModalOpen(!modalOpen)}} centered>
          <MDBModalHeader toggle={() => {setModalOpen(!modalOpen)}}>Change image</MDBModalHeader>
          <MDBModalBody>

            <SelectBackground imageChange={changeImgMethod} selectedImage={currentImage} isFullScreen={true}/>

          </MDBModalBody>
          <MDBModalFooter>
            <button className="btn btn-success" onClick={() => {setModalOpen(false)}}><i className="fas fa-check"/> Apply</button>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
}