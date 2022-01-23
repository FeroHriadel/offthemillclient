import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const CartOffcanvass = () => {
    const cart = useSelector(state => state.cart);
    const showOffcanvass = useSelector(state => state.showOffcanvass);
    const dispatch = useDispatch();
    const toggleOffcanvass = () => {
        dispatch({
            type: 'TOGGLE_OFFCANVASS',
            payload: !showOffcanvass
        })
    }



    return (
        <Offcanvas show={showOffcanvass} onHide={toggleOffcanvass}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>In Cart: {cart.reduce((acc, curr) => {
                    acc += curr.inCart;
                    return acc;
                }, 0)}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {
                    cart && cart.length > 0
                    ?
                    cart.map(product => (
                        <div key={product.product_id} className='w-100'>
                            <div 
                                style={{
                                    widht: `100%`, 
                                    height: `200px`, 
                                    background: product.images[0] === null 
                                        ? `linear-gradient(to bottom left, #eee, #ccc )` 
                                        : `url(${product.images[0]}) no-repeat center center/cover`
                                }} 
                            />
                            <p>{product.title} x {product.inCart}</p>
                        </div>
                    ))
                    :
                    <p className='text-center'>No products in cart</p>
                }

                <Link to='/cart'>
                    <Button variant='primary' className='col-12'>Go to Cart</Button>
                </Link>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CartOffcanvass;
