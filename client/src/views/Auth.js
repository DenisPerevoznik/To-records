import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {useToasts} from 'react-toast-notifications'

export const Auth = () => {

    const auth = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });
    const {addToast} = useToasts();

    useEffect(() => {
       
        
        if(error){
            addToast(error.message, {appearance: "error", autoDismiss: true})
            clearError();
        }

    }, [error, clearError]);

    const changeHandler = event => {

        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async event => {

        try {
            const data = await request('/api/auth/login', "POST", {...form});
            
            auth.login(data.token, data.userId);
        } catch (error) { 
        }
    };


    return (

        <div className="row">            
            <div className="col-md-12 d-flex justify-content-center">
                <div className="card">

                    <h5 className="card-header info-color white-text text-center py-4">
                        <strong>Sign in</strong>
                    </h5>

                    <div className="card-body px-lg-5 pt-0">

                        <div className="text-center" style={{color: "#757575"}}>

                            <div className="md-form">
                                <input type="email" name="email" placeholder="Email" className="form-control" value={form.email} onChange={changeHandler}/>
                            </div>

                            <div className="md-form">
                                <input type="password" placeholder="Password" name="password" className="form-control" value={form.password} onChange={changeHandler}/>
                            </div>

                            {(() => {
                                if(loading){
                                    return (
                                        <button className="btn btn-info btn-block" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    );
                                }
                                else{
                                    return (<button className="btn btn-info btn-block" onClick={loginHandler} type="submit">Login</button>);
                                }
                            })()}

                            <p className="mt-3 mb-1">No account ?</p>
                            <Link to="/register">To register</Link>
                            
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}