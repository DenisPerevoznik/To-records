import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import '../resources/css/profile.css';
import { ChangeImageModal } from '../components/profile/ChangeImageModal';


export const Profile = () => {

  const auth = useContext(AuthContext);
  const [user, setUser] = useState();
  const [changeImgModalState, setChangeImgModalState] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [passForm, setPassForm] = useState({newPass: "", currentPass: ""});
  const [loadPass, setLoadPass] = useState(false);
  const {request} = useHttp();
  const {addToast} = useToasts();

  useEffect(() => {

    getUser();
  }, []);

  const getUser = async () => {

    try {
        const data = await request(`/api/profile/get-user/${auth.userId}`, "GET", null, 
            {Authorization: `Bearer ${auth.token}`});

        setUser(data.user);
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

  const changePassHandler = (event) => {

    setPassForm({...passForm, [event.target.name]: event.target.value});
  }

  const clickChangePassword = async () => {

    try {
        setLoadPass(true);
        const body = {...passForm, userId: auth.userId};
        const data = await request('/api/profile/change-password', "POST", body, 
            {Authorization: `Bearer ${auth.token}`});

        addToast(data.message, {appearance: "success", autoDismiss: true});
        setPassForm({newPass: "", currentPass: ""});
        setLoadPass(false);
    } catch (error) {

        setLoadPass(false);
        setPassForm({newPass: "", currentPass: ""});
        addToast(error.message, {appearance: "error"});
    }
  }
 
    return (
    <div className="row p-5" style={{backgroundColor: "#ffffffc9"}}>
        {user ? <>
        <div className="col-md-3 d-flex justify-content-center">
            <div>
                
                <div className="user-photo" style={{backgroundImage: `url(/${user.photo})`}}>
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
            </div>}
            {/* Editable block */}

        </div>
        <div className="col-12 d-flex justify-content-center">
            {!isEdit ? <button className="btn btn-primary" onClick={() => {setIsEdit(true)}}><i className="fas fa-edit"/> Edit information</button>
            : <button className="btn btn-success" onClick={saveProfileHandler}><i className="far fa-save"/> Save changes</button> }
        </div>


        <div className="col-12">
            <hr/>
        </div>

        <div className="col-md-5 col-sm-12">
            <h4>Change password:</h4>
        </div>

        <div className="col-md-5 col-sm-12">
            
            <form>
                <div className="form-group">
                    <label>Current password</label>
                    <input type="password" onChange={changePassHandler} className="form-control" 
                        value={passForm.currentPass} name="currentPass" placeholder="Enter current password"/>
                </div>

                <div className="form-group">
                    <label>New password</label>
                    <input type="password" onChange={changePassHandler} className="form-control"
                        value={passForm.newPass} name="newPass" placeholder="Enter new password"/>
                </div>

                
                <button type="button" onClick={clickChangePassword} disabled={loadPass} className="btn btn-success"><i className="fas fa-key"/> Change password</button>
                
                {loadPass &&
                <div className="spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>}
            </form>
        </div>

        <div className="col-12">
            <hr/>
        </div>






            {/* Block loading user */}
            </> : 
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Saving...</span>
            </div>}
    </div>
    );
}