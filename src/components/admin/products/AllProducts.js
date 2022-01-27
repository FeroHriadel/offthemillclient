import React, { useState, useRef, useEffect } from 'react';
import { Spinner, Table, Form, Button } from 'react-bootstrap';
import { getProducts } from '../../../actions/productActions';
import { getCategories } from '../../../actions/categoryActions';
import { getTags } from '../../../actions/tagActions';
import ToastMessage from '../../ToastMessage';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';





/******************** table of contents (sorry) ********************
    VALUES & DEFS (loading, search values, fetched products...)
    TOAST (showToast, setShowText...)
    GET INITIAL PRODUCTS (onLoad get first products...)
    INFINITE SCROLL (load more products on scroll...)
    GET CATEGORIES (get categories for search form...)
    SEARCH BY FILTER CRITERIA (search api call...)
********************************************************************/

const AllProducts = () => {
    //VALUES & DEFS
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [values, setValues] = useState({ //search values
        perpage: 6, //If you're changing this, change it in handleSubmit as well
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
                        setProductsData({message: null, products: null, perPage: 6, skip: 0, total: null});
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
        <div className='row w-100'>
            <h4 className='mb-3'>Product List</h4>
            <h6 className='mb-5'>CLICK PRODUCT TO EDIT/DELETE</h6>


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

                    <Form className='col-10 offset-1 mb-5' onSubmit={handleSubmit} style={showForm ? {display: 'block'} : {display: 'none'}}>
                        <Form.Text className="text-muted">
                            Search products...
                        </Form.Text>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select onChange={handleChange} name='category'>
                                <option value=''>Choose category</option>
                                {
                                    categories.map(c => (
                                        <option key={`catid${c.category_id}`} value={c.category_id}>{c.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Tag</Form.Label>
                            <Form.Select onChange={handleChange} name='tag'>
                                <option value=''>Choose tag</option>
                                {
                                    tags.map(t => (
                                        <option key={`tagid${t.tag_id}`} value={t.tag_id}>{t.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Product Title'
                                name='title'
                                value={values.title === null ? '' : values.title}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Brand'
                                name='brand'
                                value={values.brand === null ? '' : values.brand}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                                <Form.Label>Maximum Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder='Cheaper than...'
                                    name='maxprice'
                                    value={values.maxprice === null ? '' : values.maxprice}
                                    onChange={handleChange}
                                />
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Min. Stock Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder='Minimum Stock Quantity'
                                name='minquantity'
                                value={values.minquantity === null ? '' : values.minquantity}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Min. Sold</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder='Minimum amout of sold items'
                                name='minsold'
                                value={values.minsold === null ? '' : values.minsold}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className='mb-3 d-flex flex-column align-items-start'>
                            <Form.Label>Order By</Form.Label>
                            <Form.Select onChange={handleChange} name='orderby'>
                                <option value='title'>Title</option>
                                <option value='category_id'>Category</option>
                                <option value='price'>Price</option>
                                <option value='quantity'>Stock Quantity</option>
                                <option value='brand'>Brand</option>
                                {/*<option value='created_at'>DB Insertion</option>*/}
                            </Form.Select>
                        </Form.Group>

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



            {/*PRODUCT LIST*/}
            {
                !loading && products
                &&
                <div className='col-10 offset-1 mb-5' style={{minHeight: '100vh'}}>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Tags</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Sold</th>
                                <th>In Stock</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product, idx) => (
                                <tr key={product.product_id} style={{cursor: 'pointer'}} onClick={() => navigate(`/admin/products/edit/${product.slug}`)}>
                                    <td>{idx + 1}</td>
                                    <td>{product.title}</td>
                                    <td>{product.category_name}</td>
                                    <td>
                                        {
                                            product.tags[0] === null 
                                            ?
                                            `None`
                                            :
                                            product.tags.map(t => (t.tag_name + ' ')) 
                                        }
                                    </td>
                                    <td>{product.brand}</td>
                                    <td>{product.price/100}</td>
                                    <td>{product.sold}</td>
                                    <td>{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {
                        loadingMore
                        &&
                        <div className='w-100 text-center'>
                            <Spinner animation='border' className='my-5'/>
                        </div>
                    }
                </div>
            }



            {/* TOAST */}
            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default AllProducts
