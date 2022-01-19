import React from 'react';
import { Toast, Button } from 'react-bootstrap';


const ToastMessage = ({ showToast, setShowToast, toastText, bgColor }) => {
    /*
    include this code in parent:

    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(true);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
    const [bgColor, setBgColor] = useState(gray);

    return (
        <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
    )
    */
    

    return (
        <Toast show={showToast} style={{background: bgColor}} className='toast-message'>
            <Toast.Body className='pb-0'>
                {toastText && <p className='font-weight-bold'>{toastText}</p>}
            </Toast.Body>
        </Toast>
    )
}

export default ToastMessage