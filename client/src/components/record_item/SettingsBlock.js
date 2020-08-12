import React from 'react';
import { MDBListGroup, MDBListGroupItem } from "mdbreact";
import '../../resources/css/record-item.css';

export const SettingsBlock = ({showSettingsToggle, onChangeNameClick, onChangeSize}) => {

    return (
        <div class="settings-block" style={{display: showSettingsToggle ? "block" : "none"}}>
            <MDBListGroup>
                
                <MDBListGroupItem  active disabled><i className="fas fa-cog"/> Settings</MDBListGroupItem>
                <MDBListGroupItem onClick={onChangeNameClick} hover><i className="fas fa-pen-alt"/> Change name</MDBListGroupItem>
                <MDBListGroupItem onClick={() => {onChangeSize("4")}}  hover>
                    <i className="far fa-square"/> Set size x4</MDBListGroupItem>
                <MDBListGroupItem onClick={() => {onChangeSize("8")}} hover>
                    <i className="far fa-square"/><i className="far fa-square"/> Set size x8</MDBListGroupItem>
                <MDBListGroupItem onClick={() => {onChangeSize("12")}} hover >
                    <i className="far fa-square"/><i className="far fa-square"/><i className="far fa-square"/> Set size x12</MDBListGroupItem>
            </MDBListGroup>
        </div>
    );
}