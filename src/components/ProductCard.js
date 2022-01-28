import React, { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaEye, FaShoppingCart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist } from '../actions/wishlistActions';
import ToastMessage from '../components/ToastMessage';



const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addProductToCart } = useCart();
    const showOffcanvass = useSelector(state => state.showOffcanvass);
    const user = useSelector(state => state.user);
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



    //ADD TO WISHLIST
    const addProductToWishlist = (productId) => {
        addToWishlist(productId, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setBgColor(red);
                    setToastText(data.error);
                    setShowToast(true);
                    setTimeout(() => {setShowToast(false)}, 2000)
                } else {
                    setBgColor(gray);
                    setToastText('Product added to Wishlist');
                    setShowToast(true);
                    setTimeout(() => {setShowToast(false)}, 2000);
                }
            })
    }



    return (
        <Card style={{width: `320px`, minWidth: `240px`, margin: `0.5rem`, borderRadius: '5px', boxShadow: `-2.5px 2.5px 7.5px #666`}}>
            <Card.Body>
                <div 
                    style={product && product.images[0] !== null 
                        ? 
                        {background: `url(${product.images[0]}) no-repeat center center/cover`, height: '200px', width: '100%', borderRadius: `5px`, marginBottom: `0.5rem`} 
                        : 
                        {background: `linear-gradient(to left bottom, #ccc, #eee)`, height: '200px', width: '100%', borderRadius: `5px`, marginBottom: `0.5rem`}}
                />

                <h6 className='d-flex w-100 text-muted'>{product.category_name}</h6>

                <div className='d-flex justify-content-between align-items-center w-100'>
                    <h3 style={{cursor: 'pointer'}} onClick={() => navigate(`/products/${product.slug}`)}>
                        <FaEye />
                    </h3>

                    <p 
                        style={{fontSize: `0.65rem`, cursor: `pointer`, padding: `0`, margin: `0`}}
                        onClick={() => user && user.usertoken ? addProductToWishlist(product.product_id) : navigate('/login')}
                    >
                        + TO WISHLIST
                    </p>

                    <h3>${product.price/100}</h3>
                </div>

                <div className='w-100 d-flex flex-wrap' style={{height: `25px`}}>
                    {
                        product.tags && product.tags[0] !== null
                        &&
                        product.tags.map(tag => (
                            <h6 className='mr-1' key={`tag${tag}`}>
                                <Badge bg="primary">{tag}</Badge>
                            </h6>
                        ))
                    }
                </div>

                <Card.Title className='d-flex justify-content-center align-items-center w-100' style={{height: `40px`}}>{product.title}</Card.Title>
                
                <Card.Text style={{height: `75px`}} className='d-flex w-100'>
                    {product && product.description ? `${product.description.substring(0, 50)}...` : `No description provided`}
                </Card.Text>

                <Button variant='dark' className='col-12' disabled={product.quantity < 1} onClick={() => {addProductToCart(product); toggleOffcanvass()}}>
                    <FaShoppingCart style={{transform: `translateY(-2.5px)`}}/> {product.quantity < 1 ? 'Sold out :(' : 'Add to Cart'}
                </Button>
            </Card.Body>

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </Card>
    )
}

export default ProductCard
