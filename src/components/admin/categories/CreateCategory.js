import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import ToastMessage from '../../ToastMessage';
import { useSelector } from 'react-redux';
import { createCategory } from '../../../actions/categoryActions';
import { useNavigate } from 'react-router-dom';



const CreateCategory = () => {
    //VALUES
    const [category, setCategory] = useState('');
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [blockBtn, setBlockBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    
    
    
    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const [bgColor, setBgColor] = useState(gray);



    //clean up after async func
    const isMounted = useRef(true);
    useEffect(() => {
        return () => isMounted.current = false;
    }, [isMounted]);


    
    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (blockBtn) return;
        if (!category || category.trim() === '') {
            setBgColor(red);
            setToastText('Category name cannot be empty');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
            return
        }

        setBlockBtn(true);
        setLoading(true);
        if (isMounted) {
            createCategory(category, user.usertoken)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setBgColor(red);
                    setToastText(data.error ? data.error : 'Failed. Category NOT created.');
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
                    setCategory('');
                    setTimeout(() => {
                        setShowToast(false);
                    }, 2500);
                }
            })
        }
    }
    


    //RENDER
    return (
        <div>
            <h4 className='mb-3'>Create Category</h4>

            <div className='row'>
                <Form onSubmit={handleSubmit} className='col-md-10 offset-md-1 d-flex flex-column align-items-center'>
                    <Form.Group className="mb-3 col-11" controlId="formBasicText">
                        <Form.Label>Category name</Form.Label>
                        <Form.Control type="text" placeholder="Category name" value={category} onChange={(e) => {setCategory(e.target.value)}} autoFocus={true} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className='col-11'>
                        {!loading && 'Submit'}
                        {loading && <Spinner animation="border" />}
                    </Button>
                </Form>

                <div className='col-md-10 offset-md-1 d-flex flex-column align-items-center mt-3' onClick={() => {navigate('/admin/categories')}}>
                    <Button variant="secondary" className='col-11'>Back to Categories</Button>
                </div>

                <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
            </div>
        </div>
    )
}

export default CreateCategory
