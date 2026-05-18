import React, { useState } from 'react';

import { Link,useNavigate} from 'react-router-dom';

import {setAccessToken,setRefreshToken} from '../services/authService';

import {login} from '../services/Login';

import Toast from "../components/Toast";

import '../styles/LoginPage.css';

function LoginForm() {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            email: '',
            password: ''
        });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const [toast, setToast] =
        useState({
            show: false,
            message: "",
            type: ""
        });

    const handleChange = (e) => {

        const {name, value} = e.target;

        setFormData({ ...formData, [name]: value});
    };

    const validate = () => {

        const newErrors = {};

        if(!formData.email.trim()) {

            newErrors.email = 'Email is required';

        } else if (!/^[^\s@]+@[^\s@]+\.com$/.test(formData.email) ) {

            newErrors.email = 'Enter a valid email';
        }

        if(!formData.password.trim()) {

            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        return (Object.keys(newErrors).length === 0);
    };

    const showToast = (
        message,
        type
    ) => {

        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {

            setToast({
                show: false,
                message: "",
                type: ""
            });

        }, 3000);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setApiError('');

        if(!validate()) return;

        try {

            setLoading(true);

            const response = await login(formData);

            setAccessToken(response.token);

            setRefreshToken(response.refreshToken);

            localStorage.setItem("userId",response.id);

            localStorage.setItem("role",response.role);

            localStorage.setItem("fullName",response.user_name);

           
            showToast("Login successful","success");

            setTimeout(() => {

                if(response.role ==="ADMIN") {
                    navigate("/admin/home");

                } else {

                    navigate("/user/");
                }

            }, 1500);

        } catch(error) {

            console.log(error);

        
            setApiError("Invalid email or password");

        } finally {

            setLoading(false);
        }
    };

    const firstError = errors.email || errors.password;

    return (

        <div className="login-container">

            
            <div className="login-left">

                <img
                    src="/assets/logo.png"
                    alt="SmartBuy Logo"
                    className="logo"
                />

            </div>

            <div className='login-right'>

                <div className='login-card'>

                    <h2 className='login-title'>Login </h2>

                    <form onSubmit={ handleSubmit}>

                        <div className='form-group'>

                            <label>Email</label>

                            <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder='Enter your email'/>

                        </div>

                        <div className='form-group'>

                            <label> Password</label>

                            <input type="password" name="password" value={formData.password} onChange={ handleChange } placeholder='Enter your password' />

                        </div>

                       
                        {
                            firstError && (

                                <p className="error-text">

                                    {firstError}

                                </p>
                            )
                        }
                        {
                            !firstError && apiError && (
                                <p className='error-text'> {apiError} </p>
                            )
                        }
    
                        <button type="submit" className='login-btn' disabled={loading} >

                          Login

                        </button>

                    </form>

                
                    <p className='register-text'>

                        Not registered yet?

                        <Link to="/register">
                            Register Now
                        </Link>

                    </p>

                </div>

            </div>

           
            {
                toast.show && (

                    <Toast
                        message={
                            toast.message
                        }
                        type={
                            toast.type
                        }
                    />
                )
            }

        </div>
    );
}

export default LoginForm;