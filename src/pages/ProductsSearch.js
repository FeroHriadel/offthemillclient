import React, { useState, useRef, useEffect } from 'react';
import { Spinner, Table, Form, Button, FormGroup } from 'react-bootstrap';
import { getProducts } from '../actions/productActions'
import { getCategories } from '../actions/categoryActions';
import { getTags } from '../actions/tagActions';
import ToastMessage from '../components/ToastMessage';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaBackward } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';



/******************** table of contents (sorry) ********************
    VALUES & DEFS (loading, search values, fetched products...)
    TOAST (showToast, setShowText...)
    GET INITIAL PRODUCTS (onLoad get first products...)
    INFINITE SCROLL (load more products on scroll...)
    GET CATEGORIES (get categories for search form...)
    SEARCH BY FILTER CRITERIA (search api call...)
********************************************************************/

const ProductsSearch = () => {
    //VALUES & DEFS
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [values, setValues] = useState({ //search values
        perpage: 3, //If you're changing this, change it in handleSubmit as well
        skip: 0,
        category: '',
        tag: '',
        title: '',
        description: '',
        brand: '',
        maxprice: '',
        minquantity: '',
        minsold: '',
        orderby: 'title'
    });
    const [productsData, setProductsData] = useState({ //getProducts response values
        message: null,
        products: null,
        perPage: null,
        skip: null,
        total: null
    });
    const { products, total, perPage, skip } = productsData;



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const [bgColor, setBgColor] = useState(gray);



    //GET INITIAL PRODUCTS
    useEffect(() => {
        if (isMounted) {
            setLoading(true);
            getProducts(values)
                .then(data => {
                    if (data && data.error) {
                        setLoading(false);
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 3000);
                    } else {
                        setProductsData(data)
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted]);
    


    //INFINITE SCROLL
    const loadMore = () => {
        let documentHeight = window.document.body.scrollHeight
        let screenHeight = window.innerHeight;
        let scrolled = window.scrollY;

        let newSkip = skip + perPage;
        if (scrolled + screenHeight >= 0.7 * documentHeight && total > newSkip && canLoadMore) {
            setCanLoadMore(false);
            setLoadingMore(true);
            getProducts({...values, skip: newSkip})
                .then(data => {
                    if (data && data.error) {
                        setLoadingMore(false);
                        console.log(data.error);
                        setCanLoadMore(true);
                    } else {
                        setProductsData({...data, products: [...products, ...data.products]});
                        setLoadingMore(false);
                        setCanLoadMore(true);
                    }
                })
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', loadMore);

        return () => document.removeEventListener('scroll', loadMore);
    })



    //GET CATEGORIES
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        if (isMounted && products) { //delay call => db only has 2 connections
            getCategories()
                .then(data => {
                    if (data && data.error) console.log(data.error);
                    else {
                        setCategories([...data.categories]);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, products]);



    //GET TAGS
    const [tags, setTags] = useState(null);

    useEffect(() => {
        if (isMounted && categories) {
            getTags()
                .then(data => {
                    if (data && data.error) console.log(data.error)
                    else setTags(data.tags)
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, categories])



    //SEARCH BY FILTER CRITERIA
    const [showForm, setShowForm] = useState(false); // hides/shows search form

    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
    }
        
    const handleSubmit = e => {
        e.preventDefault();
            
        if (isMounted) {
            setProductsData({message: null, products: null, perPage: null, skip: null, total: null})
            setLoading(true);
            getProducts({...values, skip: 0})
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setProductsData({message: null, products: null, perPage: 3, skip: 0, total: null});
                        setLoading(false);
                        setTimeout(() => {
                            setShowToast(false);
                        }, 3000)
                    } else {
                        setProductsData(data);
                        setLoading(false);
                    }
                })
        }
    }




    //RENDER
    return (
        <div className='container'>

            {/* go back btn */}
            <Button 
                variant='secondary'
                onClick={() => navigate(-1)}
                className='mt-5 col-sm-3'
            >
                <FaBackward style={{transform: `translateY(-2.5px)`}} />
                {' '}
                Go Back
            </Button>



            {/*HEADER*/}
            <h1 className='my-5 text-center'>Products</h1>



            {/* SEARCH FORM */}
            {
                categories && tags
                &&
                <React.Fragment>
                    <p 
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FaSearch />
                        <span style={{marginLeft: '10px'}}>{showForm ? 'Hide Searchbar' : 'Show Searchbar'}</span>
                    </p>


                    <Form className='col-md-8 offset-md-2 mb-5' onSubmit={handleSubmit} style={showForm ? {display: 'block'} : {display: 'none'}}>
                    
                        <div className='w-100 text-center mb-3'>
                            <small className='text-muted'>Search...</small>
                        </div>

                        <div className='row'>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                    <Form.Select onChange={handleChange} name='category'>
                                        <option value=''>Choose category</option>
                                        {
                                            categories.map(c => (
                                                <option key={`catid${c.category_id}`} value={c.category_id}>{c.name}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                    <Form.Select onChange={handleChange} name='tag'>
                                        <option value=''>Choose Label</option>
                                        {
                                            tags.map(t => (
                                                <option key={`tagid${t.tag_id}`} value={t.tag_id}>{t.name}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                    <Form.Control
                                        type="text"
                                        placeholder='Product Name'
                                        name='title'
                                        value={values.title === null ? '' : values.title}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                    <Form.Control
                                        type="text"
                                        placeholder='Brand'
                                        name='brand'
                                        value={values.brand === null ? '' : values.brand}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                        <Form.Control
                                            type="number"
                                            placeholder='Cheaper than...'
                                            name='maxprice'
                                            value={values.maxprice === null ? '' : values.maxprice}
                                            onChange={handleChange}
                                        />
                                </Form.Group>
                            </div>

                            <div className='col-md-6'>
                                <Form.Group className='mb-3 d-flex flex-column align-items-center'>
                                    <Form.Select onChange={handleChange} name='orderby'>
                                        <option value='title'>Order by Name</option>
                                        <option value='category_id'>Order By Category</option>
                                        <option value='price'>Order By Price</option>
                                        <option value='brand'>Order by Brand</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Button variant='primary' type='submit' className='col-12'>Search</Button>
                        </Form.Group>
                    </Form>
                </React.Fragment>
            }



            {/*LOADER */}
            {
                loading
                &&
                <div className='w-100 text-center'>
                    <Spinner animation='border' className='my-5'/>
                </div>
            }



            {/*FOUND PRODUCTS*/}
            {
                !loading && products
                &&
                <section className='found-products my-5'>
                    
                    <div className='found-products-cards d-flex flex-wrap justify-content-center w-100'>
                        {
                            products && products.length === 0
                            ?
                            <p>No products found</p>
                            :
                            products.map(product => (
                                <ProductCard key={product.product_id} product={/*sorry about this, server returns product data slightly different than ProductCard expects*/{...product, tags: product.tags.map(t => t && t.tag_name ? t.tag_name : null), images: product.images.map(img => img && img.url ? img.url : null)}} />
                            ))
                        }
                    </div>

                    {
                        loadingMore
                        &&
                        <div className='w-100 text-center'>
                            <Spinner animation='border' className='my-5'/>
                        </div>
                    }
                </section>
            }



            {/* TOAST */}
            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default ProductsSearch

