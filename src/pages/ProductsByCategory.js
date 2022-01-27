import React, { useRef, useState, useEffect } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { getCategory } from '../actions/categoryActions';
import ToastMessage from '../components/ToastMessage';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaBackward } from 'react-icons/fa';
import { getProducts } from '../actions/productActions';
import ProductCard from '../components/ProductCard';
import Meta from '../components/Meta';



const ProductsByCategory = () => {
    //VALUES
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const isMounted = useRef(true);
    const params = useParams();
    const categorySlug = params.slug;
    const navigate = useNavigate();



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
    const [bgColor, setBgColor] = useState(gray);



    //GET CATEGORY
    useEffect(() => {
        if (isMounted) {
            getCategory(categorySlug)
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setTimeout(() => {setShowToast(false)}, 5000);
                    } else {
                        setCategory(data.category)
                    }
                })
        }

        return () => isMounted.current = false;
    }, []);



    //GET PRODUCTS
    const [values, setValues] = useState({ //search values
        perpage: 3,
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
        products: null, //products are here, other keys are for pagination
        perPage: null,
        skip: null,
        total: null
    });
    const { products, total, perPage, skip } = productsData;

    useEffect(() => {
        if (isMounted && category) {  //delay api call => db only has 2 connections
            getProducts({...values, category: category.category_id})
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setTimeout(() => {setShowToast(false)}, 5000)
                    } else {
                        setProductsData(data);
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, category]);



    //INFINITE SCROLL
    const [loadingMore, setLoadingMore] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);

    const loadMore = () => {
        let documentHeight = window.document.body.scrollHeight
        let screenHeight = window.innerHeight;
        let scrolled = window.scrollY;

        let newSkip = skip + perPage;
        if (scrolled + screenHeight >= 0.7 * documentHeight && total > newSkip && canLoadMore) {
            setCanLoadMore(false);
            setLoadingMore(true);
            getProducts({...values, skip: newSkip, category: category.category_id})
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



    //RENDER
    return (
        <div className='container'>

            <Meta title='Off the Mill | Categories' description='categories' ogTitle='Off the Mill | Categories' ogDescription='categories' />

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


            
            {/* loader */}
            {
                loading
                &&
                <div className='w-100 text-center mt-5'>
                    <Spinner animation='border' />
                </div>
            }



            {/* product cards */}
            {
                !loading && products
                &&
                <section className='products-by-category my-5'>
                    <h1 className='products-by-category-header mb-3 text-center'>Products in {category.name}</h1>

                    <div className='products-by-category-cards d-flex flex-wrap justify-content-center w-100'>
                        {
                            products && products.length === 0
                            ?
                            <p>No products in this category</p>
                            :
                            products.map(product => (
                                <ProductCard key={product.product_id} product={/*sorry about this, server returns product data slightly different than ProductCard expects*/{...product, tags: product.tags.map(t => t && t.tag_name ? t.tag_name : null), images: product.images.map(img => img && img.url ? img.url : null)}} />
                            ))
                        }
                    </div>
                </section>

            }



            {/* loading more - loader */}
            {
                loadingMore
                &&
                <div className='w-100 text-center mt-5'>
                    <Spinner animation='border' />
                </div>
            }



            {/* adds extra space in case user has very heigh screen */}
            <div className='extra-space' style={{height: '500px'}} />

            
            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}



export default ProductsByCategory
