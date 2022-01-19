import React, { useState} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ToastMessage from '../ToastMessage';
import { changePassword } from '../../actions/userActions';
import { useSelector } from 'react-redux';



const PasswordUpdateForm = () => {
    //VALUES
    const [newPassword, setNewPassword] = useState('');
    const user = useSelector(state => state.user);
    const [blockBtn, setBlockBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    
    
    
    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
    const [bgColor, setBgColor] = useState(gray);



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (blockBtn) return;
        if (!newPassword || newPassword.trim() === '') {
            setBgColor(red);
            setToastText('Password cannot be empty');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
            return
        }

        setBlockBtn(true);
        setLoading(true);
        changePassword(newPassword, user.usertoken)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setBgColor(red);
                    setToastText(data.error ? data.error : 'Password update failed');
                    setShowToast(true);
                    setBlockBtn(false);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 2500);
                } else {
                    setLoading(false);
                    setBgColor(gray);
                    setToastText(data.message);
                    setShowToast(true);
                    setBlockBtn(false);
                    setNewPassword('');
                    setTimeout(() => {
                        setShowToast(false);
                    }, 2500);
                }
            })
    }



    //RENDER
    return (
        <div className='row'>
            <h4 className='mt-5'>CHANGE PASSWORD</h4>
            <Form onSubmit={handleSubmit} className='col-md-6 offset-md-3 d-flex flex-column align-items-center'>
                <Form.Group className="mb-3 col-11" controlId="formBasicPassword">
                    <Form.Label>Enter new password</Form.Label>
                    <Form.Control type="password" placeholder="New password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}} autoFocus={true} />
                </Form.Group>

                <Button variant="primary" type="submit" className='col-11'>
                    {!loading && 'Submit'}
                    {loading && <Spinner animation="border" />}
                </Button>
            </Form>

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default PasswordUpdateForm
