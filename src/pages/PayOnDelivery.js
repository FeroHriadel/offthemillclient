import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FaBackward } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { verifyCart } from '../actions/productActions';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';



const PayOnDelivery = () => {
    //VALUES
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const address = useSelector(state => state.address);
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart); //redux.cart (w/o verified prices)
    const [APIError, setAPIError] = useState(''); //API error
    const [APILoading, setAPILoading] = useState(true); //API loading
    const [cartTotal, setCartTotal] = useState(null); //populated by verifyCart() => returns real product.price
    const [verifiedCart, setVerifiedCart] = useState(null); //populated by verifyCart()
    const [orderProcessing, setOrderProcessing] = useState(null); //shows `loader` for createOrder()
    const isMounted = useRef(true);
    const [disabled, setDisabled] = useState(true);



    //GET VERIFIEDCART & CARTTOTAL FROM API
    useEffect(() => {
        if (isMounted) {
            verifyCart(cart)
                .then(data => {
                    if (data && data.error) {
                        setAPIError(data.error);
                        setAPILoading(false);
                    } else {
                        setAPIError('');
                        setCartTotal(data.total);
                        setVerifiedCart(data.cart);
                        setAPILoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //SUBMIT HANDLER
    const handleSubmit = () => {
        setOrderProcessing('processing'); 
        createOrder(address, verifiedCart, cartTotal, null, false, user.usertoken) //null=strapiPaymentInfo, false=order.paid
            .then(data => {
                if (data && data.error) {
                    setAPIError(`We are very sorry but a glitch occured. Would you please try again. We apologize for the inconvenience. ${data.error}`);
                } else {
                    localStorage.removeItem('cart');
                    dispatch({type: 'CLEAR_CART'});
                    setOrderProcessing('processed');
                }
            })
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
  
          <h1 className='text-center my-5'>PAY ON DELIVERY</h1>
        
          <div className='w-100 d-flex justify-content-center'>
            {
                APILoading
                &&
                <div className='w-100 text-center'>
                    <Spinner animation='border' />
                </div>
            }

            {
                APIError
                ?
                <div className='w-100 text-center'>
                    <Alert variant='danger'>{APIError}</Alert>
                    <Link to='/checkout'>
                        <p>Click to try again</p>
                    </Link>
                </div>
                :
                <div className='d-flex flex-column align-items-center'>
                    <h4 className='text-center text-muted mb-5'>Please confirm your Order</h4>
                    <h1 className='text-center'> <FaMoneyBillWave /> ${cartTotal/100} </h1>
                    <small className='text-center mb-3'>Will ship to: {address}</small>
                    <Button variant='primary' onClick={() => handleSubmit()}>Confirm Order</Button>
                    {
                        orderProcessing === null 
                            ? 
                            ''
                            :
                            orderProcessing === 'processing'
                            ?
                            <p className='text-center text-muted'>Processing your order...</p>
                            :
                            <p className='text-center text-muted mt-3'>Order placed. Thank you for shopping with us. Click here to view your order status: <span onClick={() => navigate('/profile/purchasehistory')} className='text-info' style={{cursor: `pointer`}}>My Orders</span></p>
                            
                    }
                </div>
            }
          </div>
  
        </div>
    );
};

export default PayOnDelivery;
