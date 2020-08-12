import React, { useState } from 'react';
import {CirclePicker} from 'react-color';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBBtn } from 'mdbreact';

export const ColorPicker = ({currentColor, changeColorMeth}) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(currentColor);

    const colorChange = (color) => {

        const hex = color.hex;
        setSelectedColor(hex);
        changeColorMeth(color.hex);
    }

    const colors = [
        "#ff7043", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", 
        "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", 
        "#2196f3", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"];

    return (
    <div>
        <a onClick={() => {setModalOpen(true)}}><i title="Change color" className="fas fa-fill-drip"/></a>
        <MDBModal isOpen={modalOpen} toggle={() => {setModalOpen(!modalOpen)}} size="sm">
            <MDBModalBody>
                <CirclePicker onChangeComplete={colorChange} colors={colors} color={selectedColor}/>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color="success" size="sm" onClick={() => {setModalOpen(false)}}>Ok</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    </div>
    );
}