import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { forgotPassword } from '../../actions/userActions';



const ForgotPassword = () => {
    //VALS & DEFS
    const [text, setText] = useState('');
    const [success, setSuccess] = useState(false);
    const [blockBtn, setBlockBtn] = useState(false);
    const [email, setEmail] = useState('');



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();
        if (blockBtn) return;
        if (!email.includes('@') || !email.includes('.')) return setText('Please enter a valid email');

        setBlockBtn(true);
        const data = await forgotPassword(email);
        if (!data || data.error) {
            setText(data.error ? data.error : `Sorry, something went wrong`);
            setBlockBtn(false);
        } else {
            setText('');
            setSuccess(true);
        }
    }

    


    return (
        <div className='container'>
            <h1 className='text-center mt-3'>FORGOTTEN PASSWORD</h1>

            <div className='row mt-5'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Please enter your email</Form.Label>
                            <Form.Control type="email" placeholder="Enter new password" name='email' value={email} onChange={e => {setEmail(e.target.value); setText(''); setBlockBtn(false)}} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='col-12'>
                            Submit
                        </Button>

                        {
                            text
                            &&
                            <Alert variant='danger' className='mt-3 text-center'>{text}</Alert>
                        }

                        {
                            success
                            &&
                            <Alert variant='primary' className='mt-3 text-center'>We sent you an email. Please follow the instructions to reset your password. You may now close this page.</Alert>
                        }
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
