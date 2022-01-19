import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { preSignup } from '../../actions/userActions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const RegisterForm = () => {
    //VALUES & DEFS
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successText, setSuccessText] = useState('');
    const [blockForm, setBlockForm] = useState(false);
    const [state, setState] = useState({email: '', password: ''});
    const { email, password } = state;
    


    //REDIRECT SIGNED-IN USERS AWAY
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email) {
            navigate('/');
        }
    }, [user])




    const handleChange = e => {
        setShowError(false);
        setState({...state, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (blockForm) return;
        if (!email || !password) {
            setErrorText('Please fill in both email and password');
            setShowError(true);
            return
        }
        if (!email.includes('@') || !email.includes('.')) {
            setErrorText('Please provide a valid email');
            setShowError(true);
            return
        }
        
        setBlockForm(true);
        const res = await preSignup(email, password);
        if (!res || res.error) {
            setErrorText(res.error ? res.error : `Something went wrong. Please, try again later.`);
            setShowError(true);
            setBlockForm(false);
            return
        }

        setShowError(false);
        setErrorText('');
        setSuccessText(res.message);
        setShowSuccess(true);   
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name='email' value={email} onChange={handleChange} disabled={blockForm} autoFocus />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name='password' value={password} onChange={handleChange} disabled={blockForm} />
            </Form.Group>

            <Button variant="primary" type="submit" className='btn col-12'>
                Submit
            </Button>

            {showError && <Alert variant='danger mt-3 text-center'>{errorText && errorText}</Alert>}
            {showSuccess && <Alert variant='primary mt-3 text-center'>{successText && successText}</Alert>}
        </Form>
    )
}

export default RegisterForm
