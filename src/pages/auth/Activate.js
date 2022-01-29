import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signup } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import Meta from '../../components/Meta';



const Activate = () => {
    //VALUES AND DEFS
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [text, setText] = useState('Please click the button to complete your registration...');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const navigate = useNavigate();



    //GET TOKEN FROM PARAMS
    const params = useParams();
    const token = params.token;



    //COMPLETE REGISTRATION
    const completeRegistration = async () => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        setText('Completing your registration...');
        dispatch(signup(token));
    }



    //HANDLE COMPLETE REGISTRATION RESPONSE
    useEffect(() => {
        if (user && user.email) {
            setButtonDisabled(true);
            setText('Thank you for registering! Redirecting...');
            setTimeout(() => {
                navigate('/profile');
            }, 2500);
        }

        if (user && user.error) {
            setText(user.error);
            setButtonDisabled(false);
        }
    }, [user]);



    //RENDER
    return (
        <div className='text-center'>
            <Meta title='Off the Mill | Activate Account' />
            <h1 className='m-5'>{text}</h1>
            <div >
                <Button variant='primary' onClick={() => completeRegistration()}>Complete Registration</Button>
            </div>
        </div>
    )
}

export default Activate
