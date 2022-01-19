import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../actions/userActions';
import { Form, Button, Alert } from 'react-bootstrap';




const ResetPassword = () => {
    //VALS & DEFS
    const params = useParams();
    const resettoken = params.resettoken;
    const [newPassword, setNewPassword] = useState('');
    const [blockBtn, setBlockBtn] = useState(false);
    const [text, setText] = useState({text: '', type: null});



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();
        if (blockBtn) return;
        if (!newPassword) return setText({text: `New Password is required`, type: `danger`});

        setBlockBtn(true);
        const data = await resetPassword(resettoken, newPassword);
        if (!data || data.error) {
            setText({text: data.error ? data.error : `Something went wrong`, type: `danger`});
            setBlockBtn(false);
        } else {
            setText({text: data.message, type: `primary`});
        }
    }



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center mt-3'>RESET PASSWORD</h1>

            <div className='row mt-5'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Please enter your new password</Form.Label>
                            <Form.Control type="password" placeholder="Enter email" name='newPassword' value={newPassword} onChange={e => {setNewPassword(e.target.value); setText({text: '', type: null}); setBlockBtn(false)}} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='col-12'>
                            Submit
                        </Button>
                        
                        {
                            text.type === `danger`
                            &&
                            <Alert variant={text.type} className='mt-3 text-center'>{text.text}</Alert>
                        }

                        {
                            text.type === `primary`
                            &&
                            <Alert variant={text.type} className='mt-3 text-center'>{text.text}</Alert>
                        }
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
