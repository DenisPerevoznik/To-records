import React, { useState, useEffect, useContext } from 'react';
import { NotepadItem } from '../components/notepad_item/NotepadItem';
import {CreateNotepad} from '../components/notepad_item/CreateNotepad'
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useToasts } from 'react-toast-notifications';


export const Available = () => {

  const auth = useContext(AuthContext);
  const [notepads, setNotepads] = useState([]);
  const [loader, setLoader] = useState(true);
  const {request} = useHttp();
  const {addToast} = useToasts();
  

  useEffect(() => {
    
    getNotepads();
  }, []);

  const getNotepads = async () => {

    try {
      
      setLoader(true);
      const data = await request(`/api/notepad/available/${auth.userId}`, "GET", null, {Authorization: `Bearer ${auth.token}`});
      setNotepads(data.notepads);
      setLoader(false);
      
    } catch (error) {
      
      addToast("Не удалось загрузить данные", {appearance: "error", autoDismiss: true});
      setLoader(false);
    }
  }
    return (
    <>
      {loader &&
        <div className="d-flex justify-content-center align-items-center mt-4">
            <em style={{marginRight: "10px"}}>Loading... </em>
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>

        </div>}

        <div className="row">
            <div className="col-12">
                <h2>Available to me</h2>
            </div>
        </div>

        <div className="row">
            {notepads.map(notepadItem => <NotepadItem noEdit={true} key={notepadItem._id} notepadItem={notepadItem}
                updateElementsMethod={getNotepads}/>)}
        </div>
    </>
    );
}