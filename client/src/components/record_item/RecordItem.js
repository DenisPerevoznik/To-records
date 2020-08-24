import React, { useContext, useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBBtn, MDBBtnGroup } from "mdbreact";
import { ColorPicker } from "./ColorPicker";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { useToasts } from "react-toast-notifications";
import { EditRecordModal } from "./EditRecordModal";
import renderHTML from 'react-render-html';
import '../../resources/css/scroll.css';
import '../../resources/css/record-item.css';
import { SettingsBlock } from "./SettingsBlock";

export const RecordItem = ({record, notepadId, onRemoveRecord, onModified}) => {

    const {request} = useHttp();
    const auth = useContext(AuthContext);
    const {addToast} = useToasts();
    const [colorWhiteText, setColorWhiteText] = useState(true); // переключатель для изменения цвета текста при установке фона, но котором не видно текст
    const [recordData, setRecordData] = useState(record);
    const [modalEditState, setModalEditState] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editNameToggle, setEditNameToggle] = useState(false);

    useEffect(() => {

        saveRecord();
    }, [recordData]);

    const saveRecord = async () => {

        try {
            
            setModalEditState(false);
            const data = await request('/api/notepad/save-record', "POST", 
                {record: recordData, notepadId}, {Authorization: `Bearer ${auth.token}`});
            
            
        } catch (error) {

            setRecordData({...recordData, title: record.title});
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }
    
    const removeRecord = async() => {

        if(window.confirm(`Delete the entry with the name "${recordData.title}"?`)){
            try {
            
                const data = await request(`/api/notepad/remove-record/${notepadId}/${record._id}`,
                    "DELETE", null, {Authorization: `Bearer ${auth.token}`});
    
                onRemoveRecord(data.records);
                addToast(data.message, {appearance: "info", autoDismiss: true});
            } catch (error) {
                
                addToast(error.message, {appearance: "error", autoDismiss: true});
            }
        }
    }

    const whiteTextColors = [
        "#ffeb3b"
    ]; // массив цыетов, для которых нужен белый текст

    const changeColor = (color) => {

        setRecordData({...recordData, color});

        if(whiteTextColors.includes(color, 0)){
            setColorWhiteText(false);
        }
        else{
            setColorWhiteText(true);
        }
    }

    const getDate = () => {

        const date = new Date(recordData.date);
        const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        const month = (date.getMonth() < 10 ? '0' : '') + date.getMonth();
        return (`${day}.${month}.${date.getFullYear()}`)
    }

    const saveEditedContent = (content) => {

        setRecordData({...recordData, description: content});
    }

    const changeNameHandler = (event) => {
        setRecordData({...recordData, title: event.target.value});
    }

    const changeNameClickHandler = () => {

        setEditNameToggle(true);
        setShowSettings(false);
    }

    const changeSizeHandler = async (size) => {

        setRecordData({...recordData, width: size});
    }

    const chosenClick = async () => {

        
        if(!recordData.chosen){
            addToast("🖤 Entry marked as favorite", {appearance: "success", autoDismiss: true});
        }
        else{
            addToast("💔 Record removed from favorites", {appearance: "info", autoDismiss: true});
        }
        
        const newRecordData = {...recordData, chosen: !recordData.chosen};
        setRecordData(newRecordData);
        onModified(newRecordData);
    }

    return (
        <div className={`col-lg-${recordData.width} col-md-6 col-sm-12`}>

            <MDBCard style={{margin: "10px", border: "none"}}>
                <MDBCardHeader style={{backgroundColor: recordData.color, 
                    color: colorWhiteText ? "white" : "black"}}
                        className="d-flex justify-content-between align-items-center">

                    {editNameToggle ? 
                        <>
                            <input className="form-control mr-3" type="text" maxLength="17" autoFocus
                                placeholder="Record title" onFocus={(e) => {e.target.value = recordData.title}} onBlur={changeNameHandler}/>
                            <button class="btn btn-white" title="Save"
                                onClick={() => {setEditNameToggle(false)}}><i className="far fa-save"/></button>
                        </>:
                        <>
                            {recordData.title} <ColorPicker currentColor={recordData.color} changeColorMeth={changeColor}/>
                        </>
                    }
                </MDBCardHeader>
                <MDBCardBody className="scrollbar scrollbar-primary record-content">
                    
                    {showSettings ? <SettingsBlock onChangeNameClick={changeNameClickHandler}
                        showSettingsToggle={showSettings} onChangeSize={changeSizeHandler}/> : renderHTML(recordData.description)}
                        
                </MDBCardBody>

                <MDBCardFooter small muted style={{padding: "0", backgroundColor: "#e1e1e1"}}>

                    <div className="btn-toolbar" role="toolbar">

                        <MDBBtnGroup className="mr-2" style={{width: "100%"}}>
                            <MDBBtn color="white" title="Edit record" onClick={() => {setModalEditState(true)}}>
                                <i className="fas fa-pencil-alt"/>
                            </MDBBtn>

                            <MDBBtn color="white" title="View">
                                <i className="far fa-eye"/>
                            </MDBBtn>

                            <MDBBtn color="white" onClick={() => {setShowSettings(!showSettings)}} title="Settings">
                                <i className="fas fa-cog"/>
                            </MDBBtn>
                            
                            <MDBBtn color="white" onClick={chosenClick} title="Add to favorites">
                                <i className={`${recordData.chosen ? "fas" : "far"} fa-heart`}/>
                            </MDBBtn>

                            <MDBBtn onClick={removeRecord} color="danger" title="Remove record">
                                <i className="far fa-trash-alt"/>
                            </MDBBtn>
                        </MDBBtnGroup>
                    </div>
                </MDBCardFooter>

                <EditRecordModal record={recordData} modalState={modalEditState}
                            onSave={saveEditedContent} onCancel={() => {setModalEditState(false)}}/>
            </MDBCard>
        </div>
    )
}

const cardContainer = {

    maxHeight: "300px",
    overflowY: "auto"
}