import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { AuthContext } from '../context/AuthContext';
import { MDBInput, MDBBtn } from 'mdbreact';

export const Register = () => {

    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: '', name: ""
    });
    const {addToast} = useToasts();
    const auth = useContext(AuthContext);

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

        event.preventDefault();
        try {
            const response = await request('/api/auth/register', "POST", {...form});
            addToast(response.message, {appearance: "success", autoDismiss: true});

            // login
            const loginData = await request('/api/auth/login', "POST", {...form});
            auth.login(loginData.token, loginData.userId);
            
        } catch (error) {
        }
    };

    return (

        <div className="main-container">

            <div className="main-block">
                <div className="auth-header" style={{backgroundImage: "url('https://zastavok.net/main/komputernye/156676962363.jpg')"}}>
                    <div className="overlay">
                        <h2>New account</h2>
                    </div>
                </div>
                
                <div className="auth-body">

                    <form onSubmit={registerHandler}>
                        <div className="grey-text">

                            <MDBInput label="Type your name" icon="user" group type="text" validate error="wrong"
                                    success="right" name="name" value={form.name} onChange={changeHandler} required/>

                            <MDBInput label="Type your email" icon="envelope" group type="email" validate error="wrong"
                                success="right" name="email" value={form.email} onChange={changeHandler} required/>
                            
                            <MDBInput label="Password" icon="lock" group type="password" 
                                validate name="password" value={form.password} onChange={changeHandler}/>

                            <MDBInput label="Repeat password" icon="check-double" group type="password" 
                                validate name="repeatPassword" onChange={changeHandler}/>
                        </div>
                        <div className="text-center">
                            <MDBBtn color="success" type={loading ? "button" : "submit"} disabled={loading} className="btn-auth">
                            {loading ? 
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Loading...</> 
                                :
                                    <span>Sign up</span>}
                            </MDBBtn>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        <Link to="/">Go back to login</Link>
                    </div>
                </div>
            </div>

        </div>
    );

}