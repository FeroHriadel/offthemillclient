import React from 'react';
import CartTable from '../components/cart/CartTable';



const Cart = () => {
    return (
        <div className='container mt-5'>
            <h1 className='text-center mb-3'>Your Cart</h1>
            <CartTable />
        </div>
    );
};

export default Cart;
