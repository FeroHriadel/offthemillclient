import React, { useEffect, useState, useRef } from 'react';
import grapefruitpng from '../images/grapefruit.png';
import ProductCard from '../components/ProductCard';
import { Spinner } from 'react-bootstrap';
import { getLatestProducts } from '../actions/productActions';
import { getCategories } from '../actions/categoryActions';
import { getTags } from '../actions/tagActions';
import { useNavigate } from 'react-router-dom';



const Home = () => {
    //VARS & DEFS
    const navigate = useNavigate();
    const [latestProducts, setLatestProducts] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [categories, setCategories] = useState(null);
    const [tags, setTags] = useState(null);
    const isMounted = useRef(true);




    //GET LATEST PRODUCTS
    useEffect(() => {
        if (isMounted) {
            getLatestProducts()
            .then(data => {
                if (data && data.error) {
                    setLoadingProducts(false);
                    console.log(data.error);
                } else {
                    setLatestProducts(data.products);
                    setLoadingProducts(false);
                }
            })
        }

        return () => isMounted.current = false;
    }, [isMounted])



    //GET CATEGORIES
    useEffect(() => {
        if (isMounted && latestProducts) { //delay the call => db only has 2 connections
            getCategories()
                .then(data => {
                    if (data && data.categories)
                    setCategories(data.categories);
                }) 
        }

        return () => isMounted.current = false;
    }, [isMounted, latestProducts])



    //GET TAGS
    useEffect(() => {
        if (isMounted && categories) { //delay call => db only has 2 connections
            getTags()
                .then(data => {
                    if (data && data.tags) {
                        setTags(data.tags);
                    }
                })
        }

        return () => isMounted.current = false;

    }, [isMounted, categories])




    return (
        <div className='home-page'>
        {/* showcase */}
            <main className='home-showcase d-flex justify-content-center align-items-center'>
                <img className='grapefruit-png' src={grapefruitpng} />
                <h3 className='w-75 my-5'>It has been scientifically proven that by replacing potato chips with grapefruit as a snack you can lose up to 90% of what little joy you still have left in your life... Don't... Snack happy with us</h3>
            </main>
            <div className='showcase-footer py-2 mb-5'>
                <h5 className='footer-text'>OFF THE MILL - GOODIES YOU LOVE</h5>
            </div>



            {/* new arrivals */}
            <section className='new-arrivals my-5 container text-center'>
                <h2 className='new-arrivals-header'>New Arrivals</h2>

                <div className='new-arrivals-cards w-100'>
                    {
                        loadingProducts
                        ?
                        <div className='w-100 text-center'>
                            <Spinner animation='border' />
                        </div>
                        :
                        !latestProducts || latestProducts.length === 0
                        ?
                        <p>No products yet</p>
                        :
                        latestProducts.map(product => (
                            <ProductCard product={product} key={`productId${product.product_id}`} />
                        ))
                    }
                </div>
            </section>



            {/* categories, tags, product cols */}
            <section className='categories-and-tags my-5 container'>
                <div className='row'>
                    <div className='categories-column col-sm-4 d-flex flex-column align-items-center text-center mb-2'>
                        <h2>Categories</h2>
                        {
                            categories
                            &&
                            categories.map(category => (
                                <h5 
                                    key={`categoryId${category.category_id}`} 
                                    className='text-secondary'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {window.scrollTo(0, 0); navigate(`/products/category/${category.slug}`)}}
                                >
                                    {category.name}
                                </h5>
                            ))
                        }
                    </div>
                
                    <div className='tags-column col-sm-4 d-flex flex-column align-items-center text-center mb-2'>
                        <h2>Labels</h2>
                        {
                            tags
                            &&
                            tags.map(tag => (
                                <h5 
                                    key={`tagId${tag.tag_id}`} 
                                    className='text-secondary'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {window.scrollTo(0, 0); navigate(`/products/tag/${tag.slug}`)}}
                                >
                                    {tag.name}
                                </h5>
                            ))
                        }
                    </div>

                    <div className='products-column col-sm-4 d-flex flex-column align-items-center text-center mb-2'>
                        <h2 >PRODUCTS</h2>
                        <h5 
                            className='text-secondary' 
                            style={{cursor: 'pointer'}}
                            onClick={() => {window.scrollTo(0, 0); navigate(`/products/all`)}}
                        >All Products</h5>
                        <h5 
                            className='text-secondary' 
                            style={{cursor: 'pointer'}}
                            onClick={() => {window.scrollTo(0, 0); navigate(`/products/all`)}}
                        >Search</h5>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
