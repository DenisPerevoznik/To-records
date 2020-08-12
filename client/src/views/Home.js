import React, { useState, useEffect, useContext } from 'react';
import { NotepadItem } from '../components/notepad_item/NotepadItem';
import {CreateNotepad} from '../components/notepad_item/CreateNotepad'
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useToasts } from 'react-toast-notifications';


export const Home = () => {

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
      const data = await request('/api/notepad', "GET", null, {Authorization: `Bearer ${auth.token}`});
      setNotepads(data);
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

        
        {!loader && <CreateNotepad updateElementsMethod={getNotepads}/>}
        {notepads.map(notepadItem => <NotepadItem noEdit={false} key={notepadItem._id} notepadItem={notepadItem}
          updateElementsMethod={getNotepads}/>)}
      </div>
      </>
    );
}