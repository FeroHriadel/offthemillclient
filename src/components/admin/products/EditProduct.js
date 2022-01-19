import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBySlug, updateProduct } from '../../../actions/productActions';
import { getCategories } from '../../../actions/categoryActions';
import { getTags } from '../../../actions/tagActions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../ToastMessage';
import TagsSelect from './TagsSelect';
import FileUpload from '../FileUpload';
import { Form, Spinner, Button } from 'react-bootstrap';
import DeleteProductBtn from './DeleteProductBtn';



const EditProduct = () => {
    //VARS & DEFS
    const params = useParams();
    const productSlug = params.slug;
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);
    const [blockSubmit, setBlockSubmit] = useState(false);
    const [categories, setCategories] = useState(null); // [{category_id, name, slug, created_at}, {...}]
    const [tags, setTags] = useState(null); // [{tag_id, name, slug, created_at}, {...}]
    const [imagesToDelete, setImagesToDelete] = useState([]); //imgs user removes from original product: [{url, public_id}, ...], will be deleted in handleSubmit
    const [values, setValues] = useState({
        product_id: '',
        category_id: '',
        title: '',
        description: '',
        price: '', //will be multiplied by 100 before it's sent to server (server expects cents)
        quantity: '',
        brand: '',
        tags: [], //stores tag_id's as numbers [14, 15, ...]
        images: [] //[{url: 'someurl', public_id: 'somepublic_id'}, ...]
    });



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const [bgColor, setBgColor] = useState(gray);



    //GET PRODUCT
    useEffect(() => {
        if (isMounted) {
            getProductBySlug(productSlug)
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 3000)
                    } else {
                        setValues({ //carefull here. if !tags / !images server returns: tags: [null], images: [null], not: [] !!!
                            product_id: data.product.product_id,
                            category_id: data.product.category_id,
                            title: data.product.title,
                            description: data.product.description,
                            price: data.product.price / 100, //convert from cents
                            quantity: data.product.quantity,
                            brand: data.product.brand,
                            tags: data.product.tags[0] == null ? [] : data.product.tags.map(t => Number(t.tag_id)), //remove unnecessary data, only leave: [13, 15, ...]
                            images: data.product.images[0] == null ? [] : data.product.images
                        })
                    }
                })
        }

        return () => isMounted.current = false;
    }, [productSlug])



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

    const [categoriesFetched, setCategoriesFetched] = useState(false);
    useEffect(() => {
        if (isMounted && !categoriesFetched && values && values.title) { //delay API call so db connections don't overflow
            fetchCategories();
            setCategoriesFetched(true); //don't repeat the call on values change
        }

        return () => isMounted.current = false;
    }, [isMounted, values, values.title]);



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
        if (isMounted && categories) { //delay API call so db connections don't overflow
            fetchTags();
        }

        return () => isMounted.current = false;
    }, [isMounted, categories]);



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
            //update product
            updateProduct({...values, price: Number(values.price) * 100}, user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setBlockSubmit(false);
                        setLoading(false);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 3000)
                    } else {
                        //delete imagesToDelete from Cloudinary
                        if (imagesToDelete.length) {
                            for (let i = 0; i < imagesToDelete.length; i++) {
                                fetch(`${process.env.REACT_APP_API}/images/removeimage`, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${user.usertoken}`
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({public_id: imagesToDelete[i].public_id})
                                }).then(res => {
                                    return res.json()
                                }).then(data => {
                                    if (data && data.error) console.log(data.error);
                                }).catch(err => {
                                    console.log(err)
                                })
                            }

                            setImagesToDelete([]);
                        }

                        //show success toast
                        setBgColor(gray);
                        setToastText('Product Updated');
                        setShowToast(true);
                        setTimeout(() => {setShowToast(false)}, 2500);
                        setLoading(false);
                        setBlockSubmit(false);
                    }
                })
        }
    }



    //RENDER
    return (
        <div>
            <h4 className='mb-3'>Edit Product</h4>

            <div className='row'>
                <div className='col-10 offset-1 d-flex flex-column align-items-center'>
                    
                        {
                            loading
                            &&
                            <div className='w-100 text-center'>
                                <Spinner animation='border' className='my-5'/>
                            </div>
                        }

                        {
                            tags && categories && !loading
                            &&
                            <React.Fragment>
                                <DeleteProductBtn
                                    product_id={values.product_id} 
                                    setLoading={setLoading}
                                    usertoken={user.usertoken}
                                    setBgColor={setBgColor}
                                    setToastText={setToastText}
                                    setShowToast={setShowToast}
                                />

                                <Form onSubmit={handleSubmit} className='w-100 mt-3'>

                                    <small>Fields marked * are required</small>

                                    <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                        <Form.Label>*Category</Form.Label>
                                        <Form.Select name='category_id' onChange={handleChange} value={values.category_id} >
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
                                            editingProduct={true}
                                            imagesToDelete={imagesToDelete}
                                            setImagesToDelete={setImagesToDelete}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Button variant='primary' type='submit' className='col-12'>Submit</Button>
                                    </Form.Group>
                                </Form>
                            </React.Fragment>
                        }
                </div>
            </div>

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default EditProduct