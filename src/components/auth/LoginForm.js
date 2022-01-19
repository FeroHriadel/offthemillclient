import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import GoogleButton from './GoogleButton';
import { signin, getGoogleClientId, signinWithGoogle } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const LoginForm = () => {
    //VALUES & DEFS
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const [blockForm, setBlockForm] = useState(false);
    const [state, setState] = useState({email: '', password: ''});
    const { email, password } = state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);



    //GET GOOGLE CLIENT ID (or google btn will not work)
    const [googleClientId, setGoogleClientId] = useState(null);

    useEffect(() => {
        getGoogleClientId()
            .then(data => {
                if (!data || data.error) console.log(data.error ? data.error : 'fetching googleClientId failed');
                else setGoogleClientId(data.googleClientId);
            })
    }, []);



    //CHANGE HANDLER
    const handleChange = e => {
        setShowError(false);
        setState({...state, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();
        if (blockForm) return;
        if (!email || !password) {
            setMessageText('Please fill in both email and password');
            setShowError(true);
            return
        }
        if (!email.includes('@') || !email.includes('.')) {
            setMessageText('Please enter a valid email');
            setShowError(true);
        }

        setBlockForm(true);
        setLoading(true);
        dispatch(signin(email.toLowerCase(), password));
    }



    //HANDLE SIGNIN RESPONSE
    useEffect(() => {
        if (user && user.email) {
            setLoading(false);
            setBlockForm(true);
            setMessageText('You are now logged in. Redirecting...');
            setShowSuccess(true);

            if (user && user.role === 'admin') {
                setTimeout(() => {
                    navigate('/admin');
                }, 2500);
            } else {
                setTimeout(() => {
                    navigate('/profile');
                }, 2500);
            }
            
        }

        if (user && user.error) {
            setLoading(false);
            setMessageText(user.error);
            setShowError(true);
            setBlockForm(false);
        }
    }, [user]);




    //RENDER
    return (
        <React.Fragment>
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
                {!loading && 'Submit'}
                {loading && <Spinner animation="border" />}
            </Button>

            {showError && <Alert variant='danger mt-3 text-center'>{messageText}</Alert>}
            {showSuccess && <Alert variant='primary mt-3 text-center'>{messageText}</Alert>}
        </Form>

           {googleClientId && <GoogleButton googleClientId={googleClientId} />}
        </React.Fragment>
    )
}

export default LoginForm
