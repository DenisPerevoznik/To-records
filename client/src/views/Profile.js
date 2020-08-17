import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import '../resources/css/profile.css';
import { ChangeImageModal } from '../components/profile/ChangeImageModal';


export const Profile = () => {

  const auth = useContext(AuthContext);
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [changeImgModalState, setChangeImgModalState] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const {request} = useHttp();
  const {addToast} = useToasts();

  useEffect(() => {

    getUser();
  }, []);

  const getUser = async () => {

    try {
        setLoader(true);
        const data = await request(`/api/profile/get-user/${auth.userId}`, "GET", null, 
            {Authorization: `Bearer ${auth.token}`});

        setUser(data.user);
        setLoader(false);
    } catch (error) {
        
        addToast(error.message, {appearance: "error"});
    }
  }

  const saveProfileHandler = async () => {

    try {
        
        const data = await request('/api/profile/save-profile', "POST", {user}, 
            {Authorization: `Bearer ${auth.token}`});

        addToast(data.message, {appearance: "success", autoDismiss: true});
        setIsEdit(false);
    } catch (error) {
        
        addToast(error.message, {appearance: "error"});
    }
  }

  const changeHandler = (event) => {

    setUser({...user, [event.target.name]: event.target.value});
  }
 
    return (
    <div className="row p-5">
        {user ? <>
        <div className="col-md-3 d-flex justify-content-center">
            <div>
                
                <div className="user-photo" style={{backgroundImage: `url(/${user.photo})`}}>
                {/* ${require(`../resources/user-photos/${user ? user.photo : "default.jpg"}`)} */}
                    <button className="btn btn-primary btn-change-photo" onClick={() => {setChangeImgModalState(true)}} title="Change image">
                        <i className="fas fa-pencil-alt"/></button>
                </div>

                <ChangeImageModal modalState={changeImgModalState} onPhotoUploaded={photo => {setUser({...user, photo});}}
                    closeModal={() => {setChangeImgModalState(false)}}/>
            </div>
        </div>  
        <div className="col-md-9">
            
            {!isEdit ? <div>
                <h3>{user.name}</h3>
                <p>{user.description}</p>

                <h5>
                    <i className="far fa-building"/> {user.company}
                </h5>
            </div> : 
            
            <div>
                {/* Editable block */}

                <input type="text" name="name" placeholder="Enter your name" className="form-control" 
                    style={{margin: "10px"}} value={user.name} onChange={changeHandler}/>
                
                <textarea name="description" placeholder="About myself" className="form-control" 
                    style={{margin: "10px"}} onChange={changeHandler}>{user.description}</textarea>

                <input type="text" name="company" placeholder="Enter your company" className="form-control"
                    style={{margin: "10px"}} value={user.company} onChange={changeHandler}/>
            </div>
            
            }

        </div>
        <div className="col-12 d-flex justify-content-center">
            {!isEdit ? <button className="btn btn-primary" onClick={() => {setIsEdit(true)}}><i className="fas fa-edit"/> Edit information</button>
            : <button className="btn btn-success" onClick={saveProfileHandler}><i className="far fa-save"/> Save changes</button> }
        </div>

        <div className="col-12">
            <hr/>
            <h4>Other parameters</h4>
        </div>
            </> : 
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Saving...</span>
            </div>}
    </div>
    );
}