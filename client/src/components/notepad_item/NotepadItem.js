import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { useToasts } from 'react-toast-notifications';
import { MDBInput } from 'mdbreact';
import {ChangeImageModal} from './ChangeImageModal';
import { Link } from 'react-router-dom';
import { AccessModal } from './AccessModal';

export const NotepadItem = (props) => {

    const {notepadItem} = props;
    const {noEdit} = props;
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const {addToast} = useToasts();
    const [isEdit, setIsEdit] = useState(false);
    const [loader, setLoader] = useState(false);
    const [form, setForm] = useState({
        image: notepadItem.image,
        name: notepadItem.name,
        description: notepadItem.description
    });
    const [owner, setOwner] = useState();

    useEffect(() => {

        if(!isEdit){
         getOwner();   
        }
    }, []);

    const getOwner = async () => {

        try {
            
            const data = await request(`/api/profile/get-user/${notepadItem.owner}`, "GET", null, 
                {Authorization: `Bearer ${auth.token}`});

            setOwner(data.user);
        } catch (error) {
        }
    }

    const deleteHandler = async (event) => {

        event.preventDefault();

        const notepadName = event.target.dataset.name;
        
        const conf = window.confirm(`Do you really want to delete the "${notepadName}" record`);
        const id = event.target.dataset.id;

        if(conf){
            try {
                const data = await request(`/api/notepad/remove/${id}`, "DELETE", null, {Authorization: `Bearer ${auth.token}`});
                
                addToast(data.message, {appearance: "info", autoDismiss: true});
                props.updateElementsMethod();
            } catch (error) {
                console.log("Error delete notepad: ", error);
                
            }

            props.updateElementsMethod();
        }

        props.updateElementsMethod();
    }

    const changeHandler = (event) => {

        setForm({...form, [event.target.name]: event.target.value});
    }

    const changeImage = (image) => {
        setForm({...form, image});
    }

    const saveChangesHandler = async () => {

        setLoader(true);

        try {
            const data = await request(`/api/notepad/edit/${notepadItem._id}`, "POST", form, 
                {Authorization: `Bearer ${auth.token}`});

            addToast(data.message, {appearance: "success", autoDismiss: true});
            setLoader(false);
            setIsEdit(false);
            props.updateElementsMethod();

        } catch (error) {

            addToast(error.message, {appearance: "error", autoDismiss: true});
            setLoader(false);
        }
    }

    const cancelEdit = () => {

        setForm({
            image: notepadItem.image,
            name: notepadItem.name,
            description: notepadItem.description
        });

        setIsEdit(false);
    }

    return (
        
        <div className="col-md-3 mt-5">
            <div className="card card-cascade narrower">


                <div className="view view-cascade overlay" style={cascadeCardStyle}>
                    <img className="card-img-top" width="235" height="145" alt="not img" 
                    src={require(`../../../resources/images/${form.image}`)}
                        alt="Card image cap"/>
                    <Link to={`/home/notepad/${notepadItem._id}`}>
                        <div className="mask rgba-white-slight"></div>
                    </Link>
                </div>

                    {isEdit && 
                        <div style={{marginTop: "5px"}}>
                            <ChangeImageModal changeImgMethod={changeImage} currentImage={notepadItem.image}/>
                        </div>
                    }


                <div className="card-body card-body-cascade">

    
                    {!isEdit && <h5 className="text-primary pb-2 pt-1"><i className="fas fa-book"/> {notepadItem.name}</h5>}
                    
                    {isEdit &&
                    <MDBInput type="text" label="Notepad name" name="name" value={form.name} 
                        onChange={changeHandler}/>}
                    
                    {!isEdit && <p className="card-text">{notepadItem.description}</p>}

                    {isEdit && 
                        <MDBInput type="textarea" value={form.description} label="Description" 
                            onChange={changeHandler} name="description" maxLength="60"/>}
                    
                    {!isEdit && 
                    <div className="d-flex justify-content-between align-items-center">
                        
                        <Link to={`/notepads/notepad/${notepadItem._id}`} className="btn btn-indigo"
                            style={{color: "white"}}>Open</Link>

                        {!noEdit ? <div style={{fontSize: "20px"}}>
                            <a style={{color: "#2196f3", margin: "5px"}} onClick={() => {setIsEdit(true)}} title="Edit"><i data-id={notepadItem._id} className="far fa-edit"></i></a>
                            <AccessModal notepad={notepadItem}/>
                            <a style={{color: "#ff4444", margin: "5px"}} title="Remove" onClick={deleteHandler}><i data-name={notepadItem.name} data-id={notepadItem._id} className="far fa-trash-alt"></i></a>
                        </div> : 
                        
                        <div class="chip">
                            {!owner ? 
                                <div className="spinner-border spinner-border-sm" 
                                    style={{color: "#18d3ca"}} role="status">
                                    <span className="sr-only">Loading</span>
                                </div> :
                        
                                <><img src={`/${owner.photo}`} alt="Contact Person"/> <span title={"Owner: " + owner.name}>{owner.name}</span></>}
                        </div>}
                    </div>}

                    {isEdit && 
                        <div>
                            {!loader && 
                            
                                <div>
                                    <a onClick={saveChangesHandler} style={{color: "#1dd51a"}} title="Save changes"><i style={iconEdit} className="far fa-save"/></a>
                                    <a onClick={cancelEdit} style={{color: "#d51a1a"}} title="Cancel"><i style={iconEdit} className="fas fa-ban"/></a>
                                </div>
                            }

                            {loader && 
                            <div>
                                <em style={{marginRight: "5px"}}>Saving...</em>
                                <div className="spinner-border spinner-border-sm" 
                                    style={{color: "#18d3ca"}} role="status">
                                    <span className="sr-only">Saving...</span>
                                </div>
                            </div>}
                        </div>
                        
                    }

                </div>

            </div>
        </div>
    );
}

const cascadeCardStyle = {
    marginTop: '-1.25rem',
    marginRight: '4%',
    marginLeft: '4%',
    borderRadius: '.25rem',
    boxShadow: '0 5px 11px 0 rgba(0,0,0,0.18), 0 4px 15px 0 rgba(0,0,0,0.15)'
};

const iconEdit = {
    marginLeft: "10px",
    fontSize: "22px"
}