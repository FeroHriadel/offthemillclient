import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { verifyCart } from '../actions/productActions';



const Checkout = () => {
    //VALUES
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const confirmedAddress = useSelector(state => state.address);
    const dispatch = useDispatch();
    const [verifiedCart, setVerifiedCart] = useState(null);
    const [cartTotal, setCartTotal] = useState(null);
    const [error, setError] = useState('');
    const { clearCart } = useCart();
    const [address, setAddress] = useState('');
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);



    //PUT REDUX.ADDRESS TO ADDRESS INPUT
      //in case user navigates away and then comes back here
    useEffect(() => {
        if (confirmedAddress) setAddress(confirmedAddress)
    }, [])



    //VERIFY CART PRODUCTS
    useEffect(() => {
        if (isMounted) {
            verifyCart(cart)
                .then(data => {
                    if (data && data.error) {
                        setLoading(false);
                        setError(data.error);
                    } else {
                        setError('');
                        setLoading(false);
                        setVerifiedCart(data.cart);
                        setCartTotal(data.total);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted])



    //RENDER
    return (
        <div className='container'>
            <h1 className='text-center my-5'>Checkout</h1>


            {/*loader*/}
            {
                loading
                &&
                <div className='w-100 text-center mt-5'>
                    <Spinner animation='border' />
                </div>
            }


            {/*error*/}
            {
                !loading && error
                &&
                <div className='w-100 text-center mt-5'>
                    <Alert variant='danger'>{error}</Alert>
                    <p className='text-center mt-3' onClick={() => navigate('/cart')} style={{cursor: `pointer`}}>Back to Cart</p>
                </div>
            }


            {/*Summary*/}
            {
                !loading && verifiedCart && verifiedCart.length > 0
                &&
                <React.Fragment>
                    <h4>Order Summary</h4>
                    <Table striped bordered size='sm' className='mb-1'>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Price</td>
                                <td>Quantity</td>
                            </tr>
                        </thead>
                        <tbody>
                            {verifiedCart.map(product => (
                                <tr key={product.product_id}>
                                    <td>{product.title}</td>
                                    <td>${product.price / 100}</td>
                                    <td>{product.inCart}</td>
                                </tr>
                            ))}
                            
                            <tr>
                                <td colSpan={3} style={{textAlign: 'right'}}>
                                    TOTAL: ${cartTotal/100}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant='primary' className='mb-5' onClick={() => navigate('/cart')}>Back to Cart</Button>
                </React.Fragment>
            }


            {/* address */}
            {
                !loading && verifiedCart && verifiedCart.length > 0
                &&
                <div className='mb-5'>
                    <h4>Delivery Address: </h4>
                    <Form.Control
                        as="textarea"
                        name='address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Please enter your name and address"
                        style={{ height: '150px', marginBottom: `0.5rem` }}
                    />
                    {confirmedAddress && <p style={{fontSize: `0.75rem`}}>Will deliver to: {confirmedAddress}</p>}
                    <Button 
                        variant='primary'
                        onClick={() => {
                            dispatch({type: 'CHANGE_ADDRESS', payload: address})
                        }}
                    >{confirmedAddress ? 'Change Address' : 'Confirm Address'}</Button>
                </div>
            }


            {/* buttons */}
            {
                !loading && verifiedCart && verifiedCart.length > 0
                &&
                <div className='buttons mb-5 text-center'>
                    <Button 
                        variant='primary' 
                        style={{width: `260px`, margin: `0.25rem`}}
                        disabled={!confirmedAddress}
                        onClick={() => {navigate('/payment')}}
                    >
                        Pay
                    </Button>
                    
                    <Button 
                        variant='secondary' 
                        style={{width: `260px`, margin: `0.25rem`}}
                        onClick={() => {clearCart(); dispatch({type: 'CHANGE_ADDRESS', payload: ''}); navigate('/cart')}}
                    >
                        Clear Cart
                    </Button>
                </div>
            }
        </div>
    );
};

export default Checkout;
