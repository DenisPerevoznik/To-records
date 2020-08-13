import React from 'react';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';

export const ChangeImageModal = ({modalState = false, onCancel}) => {

    return (
        <MDBModal isOpen={modalState} centered>
            <MDBModalHeader>
                Change image profile
            </MDBModalHeader>

            <MDBModalBody>

                <label>Select image:</label>
                <input type="file" />

            </MDBModalBody>
            <MDBModalFooter>

                <button className="btn btn-danger" onClick={onCancel}><i className="fas fa-times"/> Cancel</button>
                <button className="btn btn-success" onClick={() => {}}><i className="fas fa-check"/> Save</button>
            </MDBModalFooter>
        </MDBModal>
    )
}