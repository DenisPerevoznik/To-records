import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import {useToasts} from 'react-toast-notifications'
import '../resources/css/auth-form.css';
import { MDBInput, MDBBtn } from 'mdbreact';
import { Link } from 'react-router-dom';

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

        event.preventDefault();
        try {
            const data = await request('/api/auth/login', "POST", {...form});
            auth.login(data.token, data.userId);
        } catch (error) { 
        }
    };

    return (

        <div className="main-container">

            <div className="main-block">
                    <div className="auth-header">
                        <div className="overlay">
                            <h2>Sign in</h2>
                        </div>
                    </div>
                
                <div className="auth-body">

                    <form onSubmit={loginHandler}>
                        <div className="grey-text">
                            <MDBInput label="Type your email" icon="envelope" group type="email" validate error="wrong"
                                success="right" name="email" value={form.email} onChange={changeHandler} required/>
                            
                            <MDBInput label="Type your password" icon="lock" group type="password" 
                                validate name="password" value={form.password} onChange={changeHandler}/>
                        </div>
                        <div className="text-center">
                            <MDBBtn color="success" type={loading ? "button" : "submit"} disabled={loading} className="btn-auth">
                            {loading ? 
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Loading...</> 
                                :
                                    <span>Login</span>}
                            </MDBBtn>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        {/* <button className="btn btn-link">Sign up</button> */}
                        <Link to="/register">SIGN UP</Link>
                        
                    </div>
                </div>
            </div>

        </div>
    );
}