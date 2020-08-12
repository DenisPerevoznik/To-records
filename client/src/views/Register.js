import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

export const Register = () => {

    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });
    const {addToast} = useToasts();

    useEffect(() => {
       
        if(error){

            addToast(error.message, {appearance: "error", autoDismiss: true});
            clearError();
        }

    }, [error, clearError]);

    const changeHandler = event => {

        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async event => {

        try {
            const response = await request('/api/auth/register', "POST", {...form});
            addToast(response.message, {appearance: "success", autoDismiss: true});
            
        } catch (error) {
        }
    };


    return (

        <div className="row">            
            <div className="col-md-12 d-flex justify-content-center">
                <div className="card">

                    <h5 className="card-header success-color white-text text-center py-4">
                        <strong>New account</strong>
                    </h5>

                    <div className="card-body px-lg-5 pt-0">

                        <div className="text-center" style={{color: "#757575"}}>

                            <div className="md-form">
                                <input type="text" name="name" placeholder="Your name" className="form-control" onChange={changeHandler} required/>
                            </div>

                            <div className="md-form">
                                <input type="email" name="email" placeholder="Email" className="form-control" onChange={changeHandler} required/>
                            </div>

                            <div className="md-form">
                                <input type="password" placeholder="Password" name="password" className="form-control" onChange={changeHandler} required/>
                            </div>

                            <div className="md-form">
                                <input type="password" placeholder="Repeat password" name="repeatPassword" className="form-control" onChange={changeHandler} required/>
                            </div>

                            {(() => {
                                if(loading){
                                    return (
                                        <button className="btn btn-success btn-block" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    );
                                }
                                else{
                                    return (<button className="btn btn-success btn-block" onClick={registerHandler} type="submit">To register</button>);
                                }
                            })()}

                            <Link to="/">Back to main</Link>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}