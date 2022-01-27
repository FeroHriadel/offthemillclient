import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Badge, Button, Card } from 'react-bootstrap';
import { getProductBySlug } from '../actions/productActions';
import { getReviews } from '../actions/reviewActions';
import ToastMessage from '../components/ToastMessage';
import { FaBackward, FaShoppingCart, FaSmile, FaEdit, FaTimes } from 'react-icons/fa';
import Moment from 'react-moment';
import 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import RatingModal from '../components/RatingModal';
import RatingModalEdit from '../components/RatingModalEdit';
import { useCart } from '../hooks/useCart';



const ProductDetails = () => {
    //VALUES
    const isMounted = useRef(true);
    const navigate = useNavigate();
    const { addProductToCart } = useCart();
    const params = useParams();
    const productSlug = params.slug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);
    const [currentImg, setCurrentImg] = useState(null); //saves clicked img.url



    //CART OFFCANVAS
    const showOffcanvass = useSelector(state => state.showOffcanvass);
    const dispatch = useDispatch();
    
    const toggleOffcanvass = () => {
        dispatch({
            type: 'TOGGLE_OFFCANVASS',
            payload: !showOffcanvass
        })
    }
    


    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
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
                        setLoading(false);
                        setTimeout(() => {setShowToast(false)}, 5000)
                    } else {
                        setProduct(data.product);
                        if (data.product.images[0] != null) setCurrentImg(data.product.images[0].url);
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false
    }, [isMounted]);



    //RATING MODAL
    const [modalShow, setModalShow] = useState(false);
    const [reloadReviews, setReloadReviews] = useState(true);



    //EDIT RATING MODAL
    const [editModalShow, setEditModalShow] = useState(false);
    const [editedReviewId, setEditedReviewId] = useState(null);
    


    //GET REVIEWS
    const [reviews, setReviews] = useState(null);
    const [reviewsStats, setReviewsStats] = useState({total: null, average: null});

    useEffect(() => {
        if (isMounted && reloadReviews && product && product.title) { //delaying api call => db only has 2 connections
            getReviews(product.product_id)
                .then(data => {
                    if (data && data.error) {
                        console.log(data.error);
                        setReloadReviews(false);
                        setReviews(null);
                    } else {
                        setReviews(data.reviews);
                        setReviewsStats({total: data.reviews_total, average: data.average_rating})
                        setReloadReviews(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, product, reloadReviews])



    //RENDER
    return (
        <div className='product-details-page container'>

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



            {/* big image*/}
            {
                !loading && product
                &&
                <div className='row w-100 mt-5'>
                    <section className='big-product-image col-md-6'>
                        <div
                            style={
                                currentImg == null
                                ?
                                {width: `100%`, height: `400px`, background: `linear-gradient(to bottom left, #eee, #ccc)`}
                                :
                                {width: `100%`, height: `400px`, background: `url(${currentImg}) no-repeat center center/cover`}
                            }
                        />

                        

                        {/* other images (if any) + change currentImg */}
                        {
                            product.images && product.images[0] != null && product.images.length > 1
                            &&
                            <aside className='d-flex flex-wrap mt-1 w-100 mb-5'>
                                {
                                    product.images.map(img => (
                                        <div 
                                            key={`img_id${img.public_id}`}
                                            style={{width: `100px`, minWidth: '100px', height: '75px', background: `url(${img.url}) no-repeat center center/cover`, margin: '0 5px 5px 0', cursor: 'pointer', border: currentImg === img.url ? '2px gray solid' : 'none' }}
                                            onClick={() => {setCurrentImg(img.url)}}
                                        />
                                    ))
                                }
                            </aside>
                        }
                    </section>
                            


                    {/* product info */}
                    <main className='product-details col-md-6'>
                        <h1 className='mt-3'>{product.title}</h1>
                        {
                            product.tags && product.tags[0] !== null
                            &&
                            <div className='w-100 d-flex flex-wrap'>
                                {product.tags.map(tag => (
                                    <h4 key={`tagId${tag.tag_id}`} style={{margin: `0 5px 5px 0`}}>
                                        <Badge bg="primary">{tag.tag_name}</Badge>
                                    </h4>
                                ))}
                            </div>
                        }
                        <h5>{product.category_name}</h5>
                        <br />
                        <ul style={{listStyleType: 'none'}}>
                            <li> <p> <b>Price: </b> ${product.price/100} </p> </li>
                            <li> <p> <b>Description: </b> {product.description ? product.description : 'No description provided'} </p> </li>
                            <li> <p> <b>Brand: </b> {product.brand} </p> </li>
                            <li> <p> <b> {product.quantity > 0 ? 'In Stock' : 'Sold out'} </b> </p> </li>
                            {
                                reviewsStats && reviewsStats.total
                                &&
                                <li> <p> <b>Average Rating: {Number(reviewsStats.average).toFixed(1)}/5 ({reviewsStats.total})</b> </p> </li>
                            }
                        </ul>

                        

                        {/* addToCart & createReview buttons */}
                        <Button variant='dark' className='m-1 col-12' disabled={product.quantity < 1} onClick={() => {addProductToCart({...product, images: product.images[0] == null ? [null] : product.images.map(img => img.url)}); toggleOffcanvass()}}>
                            <FaShoppingCart style={{transform: `translateY(-2.5px)`}} /> {product.quantity < 1 ? 'Sold out :(' : 'Add to Cart'}
                        </Button>
                        
                        <Button 
                            variant='secondary' 
                            className='m-1 col-12'
                            onClick={() => {
                                if (user && user.user_id) {
                                    setModalShow(true)
                                } else {
                                    navigate('/login')
                                }
                            }}
                        > 
                            <FaSmile style={{transform: `translateY(-2.5px)`}}/> Add Review
                        </Button>
                        
                    </main>
                </div>
            }



            {/* Reviews */}
            {
                reviews
                &&
                <section className='my-5 w-100'>
                    <h3>REVIEWS</h3>

                    {reviews.map(review => (
                        <Card key={`reviewid${review.review_id}`} className='mb-2'>
                            <Card.Body style={{position: `relative`}}>
                                <div>
                                    {
                                        (user && user.user_id === review.user_id) || (user && user.role === 'admin')
                                        ?
                                        <div style={{position: `absolute`, top: `0`, right: `5px`}}>
                                            <FaEdit style={{cursor: 'pointer'}} onClick={() => {setEditedReviewId(review.review_id); setEditModalShow(true);}} />
                                            <FaTimes style={{cursor: 'pointer'}} onClick={() => {setEditedReviewId(review.review_id); setEditModalShow(true)}} />
                                        </div>
                                        :
                                        '' 
                                    }
                                </div>
                                <Card.Title>Rated: {review.stars}/5</Card.Title>
                                <Card.Subtitle>
                                    By: {review.email.split('@')[0]} {' '} 
                                    <small>
                                        <Moment fromNow>{review.created_at}</Moment>
                                    </small>
                                </Card.Subtitle>
                                <Card.Text className='mt-2'>{review.comment == null ? 'No comment added' : review.comment}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </section>
            }



            {/* createReview and updateReview modals */}
            <RatingModal
                show={modalShow}
                product_id={product ? product.product_id : null}
                setReloadReviews={setReloadReviews}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
            />

            <RatingModalEdit 
                show={editModalShow}
                setEditModalShow={setEditModalShow}
                review_id={editedReviewId}
                setReloadReviews={setReloadReviews}
                onHide={() => setEditModalShow(false)}
            />



            {/*toast*/}
            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
}

export default ProductDetails
