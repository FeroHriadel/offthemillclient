import React from 'react';
import CartTable from '../components/cart/CartTable';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Cart = () => {
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart);

    return (
        <div className='container mt-5'>
            <h1 className='text-center mb-3'>Your Cart</h1>
            <CartTable />

            {
                cart && cart.length > 0
                &&
                <div className='buttons mt-5'>
                    <Button 
                        variant='primary'
                        className='m-1'
                        style={{width: `260px`}}
                        onClick={() => navigate('/checkout')}
                    >
                        Go to Checkout
                    </Button>
                    <Button 
                        variant='secondary'
                        className='m-1 col-3'
                        style={{width: `260px`}}
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            }
        </div>
    );
};

export default Cart;
