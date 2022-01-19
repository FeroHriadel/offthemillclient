import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';



const Register = () => {
    return (
        <div className='container'>
            <h1 className='text-center mt-3'>Register</h1>
            <div className='row mt-3'>
                <div className='col-md-6 offset-md-3'>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default Register
