import React, { useEffect, useRef, useState } from 'react';
import { createProduct } from '../../../actions/productActions';
import { getCategories } from '../../../actions/categoryActions';
import { getTags } from '../../../actions/tagActions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../ToastMessage';
import TagsSelect from './TagsSelect';
import FileUpload from '../FileUpload';
import { Form, Spinner, Button } from 'react-bootstrap';



const CreateProduct = () => {
    //VARS & DEFS
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);
    const [blockSubmit, setBlockSubmit] = useState(false);
    const [categories, setCategories] = useState(null); // [{category_id, name, slug, created_at}, {...}]
    const [tags, setTags] = useState(null); // [{tag_id, name, slug, created_at}, {...}]
    const [values, setValues] = useState({
        category_id: '',
        title: '',
        description: '',
        price: '', //will be multiplied by 100 before it's sent to server (server expects cents)
        quantity: '',
        brand: '',
        tags: [],
        images: [] //[{url: 'someurl', public_id: 'somepublic_id'}, ...]
    });



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const [bgColor, setBgColor] = useState(gray);



    //FETCH CATEGORIES
    const fetchCategories = async () => {
        setLoading(true);
        const data = await getCategories();
        if (data && data.error) {
            setLoading(false);
            setToastText(data.error);
            setBgColor(red);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
        } else {
            setLoading(false);
            setCategories(data.categories);
        }
    }

    useEffect(() => {
        if (isMounted) {
            fetchCategories();
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //FETCH TAGS
    const fetchTags = async () => {
        setLoading(true);
        const data = await getTags();
        if (data && data.error) {
            setLoading(false);
            setToastText(data.error);
            setBgColor(red);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2500);
        } else {
            setLoading(false);
            setTags(data.tags);
        }
    }

    useEffect(() => {
        if (isMounted) {
            fetchTags();
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //CHANGE HANDLER
    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (blockSubmit) return;
        
        setLoading(true);
        setBlockSubmit(true);

        if (isMounted) {
            createProduct({...values, price: Number(values.price) * 100}, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setToastText(data.error);
                    setBgColor(red);
                    setShowToast(true);
                    setLoading(false);
                    setBlockSubmit(false);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 3000)
                } else {
                    setValues({category_id: '', title: '', description: '', price: '', quantity: '', brand: '', tags: [], images: []});
                    setLoading(false);
                    setToastText('Product created');
                    setBgColor(gray);
                    setShowToast(true);
                    setBlockSubmit(false);
                    setTimeout(() => {
                        setShowToast(false);
                    }, 2500);
                }
            })
            .catch(error => {
                console.log(error);
                setBgColor(red);
                setToastText('Something went wrong');
                setShowToast(true);
                setBlockSubmit(false);
                setTimeout(() => {
                    setShowToast(false);
                })
            })
        }
    }



    //RENDER
    return (
        <div>
            <h4 className='mb-3'>Create Product</h4>

            <div className='row'>
                <div className='col-10 offset-1 d-flex flex-column align-items-center'>
                    
                        {
                            loading
                            &&
                            <Spinner animation='border' />
                        }

                        {
                            tags && categories && !loading
                            &&
                            <Form onSubmit={handleSubmit} className='w-100 mt-3'>

                                <small>Fields marked * are required</small>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*Category</Form.Label>
                                    <Form.Select name='category_id' onChange={handleChange}>
                                        <option>Choose Category</option>
                                        {
                                            categories.map(category => (
                                                <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>Tags</Form.Label>
                                    <TagsSelect tags={tags} values={values} setValues={setValues} />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*Product name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Product Title'
                                        name='title'
                                        value={values.title}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*Description</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        placeholder='Description'
                                        name='description'
                                        value={values.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder='Price'
                                        name='price'
                                        value={values.price}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*In Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder='Quantity'
                                        name='quantity'
                                        value={values.quantity}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>*Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Product Brand'
                                        name='brand'
                                        value={values.brand}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                    <Form.Label>Upload Image(s)</Form.Label>
                                    <FileUpload 
                                        values={values} 
                                        setValues={setValues}
                                        setBgColor={setBgColor}
                                        setToastText={setToastText}
                                        setShowToast={setShowToast} 
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Button variant='primary' type='submit' className='col-12'>Submit</Button>
                                </Form.Group>
                            </Form>
                        }
                </div>
            </div>

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default CreateProduct
