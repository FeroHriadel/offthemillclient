import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner, Alert, Form, Button } from 'react-bootstrap';
import { getCategory, updateCategory } from '../../../actions/categoryActions';
import { useSelector } from 'react-redux';



const EditCategory = () => {
    //VARS AND DEFS
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [category, setCategory] = useState(null);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    


    //GET CATEGORY
    const params = useParams();
    const categorySlug = params.slug;
    const isMounted = useRef(true); //cleanup

    useEffect(() => {
        if (isMounted) {
            getCategory(categorySlug)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setErrorText(data && data.error ? data.error : 'Something went wrong. Category NOT found');
                    setShowError(true);
                } else {
                    setShowError(false);
                    setLoading(false);
                    setCategory(data.category);
                }
            })
        }

        return () => isMounted.current = false; //still leaking, sonofabitch :(
    }, [categorySlug, isMounted]);



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (!category.name || category.name.trim() === '') {
            setErrorText('Category must have a name');
            setShowError(true);
            return
        }

        if (isMounted) {
            updateCategory(category.name, categorySlug, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setErrorText(data.error);
                    setShowError(true);
                } else {
                    setShowError(false);
                    setErrorText('Category updated');
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 2000)
                }
            })
        }
    }



    //RENDER
    return (
        <div className='col-10 offset-1'>
            {
                loading && <Spinner animation='border' />
            }

            {
                category
                &&
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>New Category Name</Form.Label>
                        <Form.Control type="text" placeholder="New name" value={category.name} onChange={(e) => {setShowError(false); setCategory({...category, name: e.target.value})}}/>
                    </Form.Group>

                    <Button variant="primary" type="submit" className='col-12'>
                        Submit
                    </Button>
                </Form>
            }

            <Button 
                variant='secondary' 
                onClick={() => navigate('/admin/categories')}
                className='mt-3 col-12'
            >
                Back to Categories
            </Button>

            {
                showError
                &&
                <Alert variant='danger' className='mt-3'>{errorText}</Alert>
            }

            {
                showSuccess
                &&
                <Alert variant='primary' className='mt-3'>{errorText}</Alert>
            }
        </div>
    )
}

export default EditCategory
