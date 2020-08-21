import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToasts } from 'react-toast-notifications';
import { RecordItem } from '../components/record_item/RecordItem';
import '../resources/css/notepad-viewing-styles.css';
import { MDBTooltip } from 'mdbreact';

export const NotepadViewing = (props) => {

    const {match: {params}} = props;
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const {addToast} = useToasts();
    const [notepad, setNotepad] = useState({});
    const [records, setRecords] = useState([]);
    const [loader, setLoader] = useState(true);
    const [onlyFav, setOnlyFav] = useState(false);

    const [temm, setTemm] = useState([]);

    useEffect(() => {

        loadNotepadData();
    }, []);

    const loadNotepadData = async () => {
        try {
            // setLoader(true);
            
            const notepad = await request(`/api/notepad/get/${params.notepadId}`, "GET", null, 
                {Authorization: `Bearer ${auth.token}`});
            
            setNotepad(notepad);
            setRecords(notepad.records);
            setRecords(notepad.records);
            setLoader(false);
            
            
        } catch (error) {
            
            addToast(error.message, {appearance: "error", autoDismiss: true});
            setLoader(false);
        }
    }

    // const searchHandler = (event) => {

    //     const searchText = event.target.value;
    //     setSearchRecords(records);
        
        
    //     if(searchText != ""){
    //         setSearchRecords(records.filter(rec => {
    //             const recTitle = rec.title.toLowerCase();
    //             return recTitle.startsWith(searchText.toLowerCase());
    //         }));
    //     }
    // }

    const addNewRecord = async () => {

        try {
            
            const data = await request('/api/notepad/create-record', "POST", {notepadId: notepad._id}, 
                {Authorization: `Bearer ${auth.token}`});

            addToast(data.message, {appearance: "success", autoDismiss: true});
            setRecords([...records, data.record]);
        } catch (error) {
            
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    const modifiedRecord = (modifiedRecord) => {

        const modIndex = records.findIndex(rec => rec._id == modifiedRecord._id);
        records[modIndex] = modifiedRecord;
    }

    const renderRecordItems = () => {

        const tempArr = onlyFav ? records.filter(rec => rec.chosen) : records;

        return (
            <>
            {tempArr.map(rec => <RecordItem key={rec._id} record={rec} notepadId={notepad._id}
                onRemoveRecord={records => {setRecords(records)}} onModified={modifiedRecord} onlyFav={onlyFav}/>)}
            </>
        );
    }

    return (

    <div className="container">
        <div className="pb-4">

            <div className="row ml-3">

                <div className="col-sm-12 col-md-3 mr-1 header-item" style={title}>
                    <MDBTooltip domElement tag="span" placement="bottom" >
                        <h2 className="short-text"><i className="fas fa-book"/> {notepad.name}</h2>
                        <span>{notepad.name}</span>
                    </MDBTooltip>
                    
                </div>

                <div className="col-md-3 col-sm-12">
                    <div className="header-item">
                        <button className="btn btn-dark" onClick={() => {setOnlyFav(!onlyFav)}}>
                            {onlyFav && <i className="fas fa-check"/>} <i className="fas fa-heart"/> Only favorites</button>
                    </div>
                </div>
            </div>

            <div className="row">
                {loader &&
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <em style={{marginRight: "5px"}}>Loading... </em>
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>

                </div>}
            </div>

            
            <div className="row mt-4">
                {renderRecordItems()}

                <div className="col-sm-12 col-md-4 d-flex justify-content-center align-items-center">
                    <div className={`blockNewRecord`} title="Add new record" onClick={addNewRecord}>
                        <i className="far fa-plus-square"/>
                        <h4 className="mb-0">New record</h4>
                        {/* <p style={{fontSize: "15px"}}>(Ctrl + V)</p> */}
                    </div>
                </div>
            </div>

        </div>
    </div>
    );
}

const title = {
    border: "1px solid #dbdbdb",
    color: "#444549"
}