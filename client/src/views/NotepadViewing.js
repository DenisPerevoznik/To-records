import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToasts } from 'react-toast-notifications';
import { RecordItem } from '../components/record_item/RecordItem';
import '../resources/css/notepad-viewing-styles.css';

export const NotepadViewing = (props) => {

    const {match: {params}} = props;
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const {addToast} = useToasts();
    const [notepad, setNotepad] = useState({});
    const [records, setRecords] = useState([]);
    const [searchRecords, setSearchRecords] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {

        loadNotepadData();
    }, []);

    const loadNotepadData = async () => {
        try {
            
            const notepad = await request(`/api/notepad/get/${params.notepadId}`, "GET", null, 
                {Authorization: `Bearer ${auth.token}`});
            
            setNotepad(notepad);
            setRecords(notepad.records);
            setSearchRecords(notepad.records);
            setLoader(false);
            
            
        } catch (error) {
            
            addToast(error.message, {appearance: "error", autoDismiss: true});
            setLoader(false);
        }
    }

    const searchHandler = (event) => {

        const searchText = event.target.value;
        setSearchRecords(records);
        
        
        if(searchText != ""){
            setSearchRecords(records.filter(rec => {
                const recTitle = rec.title.toLowerCase();
                return recTitle.startsWith(searchText.toLowerCase());
            }));
        }
    }

    const addNewRecord = async () => {

        try {
            
            const data = await request('/api/notepad/create-record', "POST", {notepadId: notepad._id}, 
                {Authorization: `Bearer ${auth.token}`});

            addToast(data.message, {appearance: "success", autoDismiss: true});
            setSearchRecords([...searchRecords, data.record]);
        } catch (error) {
            
            addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    return (
        <div className="pb-4">

            <div className="row d-flex justify-content-center pt-3">


                <div className="col-md-3">
                    
                    <div className="head-item">
                        <i className="fas fa-book"/>
                        <h3>{notepad.name}</h3>
                    </div>

                </div>

                <div className="col-md-3">
                    <div className="head-item">
                        <i className="far fa-plus-square"/>
                        <button className="btn btn-success" onClick={addNewRecord} style={{backgroundColor: "#46c261"}}>
                            Create record</button>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="head-item">
                        <i className="fas fa-palette"/>
                        <button className="btn btn-primary">Select theme</button>
                    </div>
                </div>

                <div className="col-md-3 pl-0">
                    <div className="head-item" style={{width: "100%"}}>
                        <i className="fas fa-search" style={{marginLeft: "-16.2rem"}}/>
                        <input onChange={searchHandler} className="form-control form-control-sm ml-3 w-100" 
                                    type="text" placeholder="Search" aria-label="Search" />
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
                {searchRecords.map((rec, index) => <RecordItem key={rec._id} record={rec} notepadId={notepad._id}
                    onRemoveRecord={records => {setSearchRecords(records)}}/>)}

                <div className="col-sm-12 col-md-4 d-flex justify-content-center align-items-center">
                    <div className="blockNewRecord" title="Add new record" onClick={addNewRecord}>
                        <i className="far fa-plus-square"/>
                        <h4 className="mb-0">New record</h4>
                        <p style={{fontSize: "15px"}}>(Ctrl + V)</p>
                    </div>
                </div>
            </div>

        </div>
    );
}




// const overlap = {
//     width: "100%",
//     height: "100%",
//     borderRadius: "7px",
//     backgroundColor: "rgba(0, 0, 0, 0.24)",
//     color: "white"
// }

// const sticky = {
//     top: "0",
//     position: "sticky"
// }

// const notepadImgMiniBanner = {
//     width: "50px",
//     height: "100%",
//     backgroundColor: "blue"
// }