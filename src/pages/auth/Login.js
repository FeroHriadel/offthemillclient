import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import Meta from '../../components/Meta';




const Login = () => {
    const navigate = useNavigate();



    return (
        <div className='container'>
            <Meta title='Off the Mill | Login' />

            <h1 className='text-center mt-3'>Log in</h1>
            <div className='row mt-3'>
                <div className='col-md-6 offset-md-3'>
                    <LoginForm />
                    <h5 className='mt-3 text-center'>
                        <span 
                            className='text-info' 
                            style={{cursor: `pointer`}}
                            onClick={() => navigate('/forgotpassword')}
                        >
                            Forgot
                        </span>
                        {' '}
                        your password?
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Login
