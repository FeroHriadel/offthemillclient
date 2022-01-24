import React, { useEffect, useState, useRef } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { createPaymentIntent } from '../actions/stripeActions';
import { verifyCart } from '../actions/productActions';
import { FaMoneyBillWave } from 'react-icons/fa';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const StripeCheckout = () => {
    //VALUES
    const user = useSelector(state => state.user);
    const address = useSelector(state => state.address);
    const cart = useSelector(state => state.cart);
    const [APIError, setAPIError] = useState('');
    const [APILoading, setAPILoading] = useState(true);
    const [cartTotal, setCartTotal] = useState(null);
    const [verifiedCart, setVerifiedCart] = useState(null);
    const isMounted = useRef(true);
    const [succeeded, setSuceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();



    //GET VERIFIED CART TOTAL FROM API
    useEffect(() => {
        if (isMounted) {
            verifyCart(cart)
                .then(data => {
                    if (data && data.error) {
                        setAPIError(data.error);
                    } else {
                        setAPIError('');
                        setCartTotal(data.total);
                        setVerifiedCart(data.cart);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted])



    //GET CLIENT SECRET FROM API
    useEffect(() => {
        if (isMounted && cartTotal) {
            createPaymentIntent(user.usertoken, address, cartTotal)
                .then(data => {
                    if (data && data.error) {
                        setAPIError(data.error);
                        setAPILoading(false);
                    } else {
                        setClientSecret(data.clientSecret);
                        setAPILoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, cartTotal])



    //SUBMIT HANDLER
    const handleSubmit = async e => {
        e.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {card: elements.getElement(CardNumberElement)},
            billing_details: {name: e.target.name.value}
        })

        if (payload.error) {
            setError(`Payment failed. ${payload.error.message}`);
            setProcessing(false);
        } else {
            console.log(payload);
            setError(null);
            setProcessing(false);
            setSuceeded(true);
        }
    }



    //CHANGE HANDLER
    const handleChange = e => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : '');
    }



    //STRIPE INPUT STYLING
    const cardStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d",
            },
          },
          invalid: {
            color: "#d9534f",
            iconColor: "#fa755a",
          },
        },
      };



  //RENDER
  return (
    <React.Fragment>

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
            <form className='stripe-form mb-5' onSubmit={handleSubmit} hidden={APILoading}>

                <h6 className='text-center text-muted'>Please fill out you card details to complete the payment</h6>
                <h1 className='tex-center'> <FaMoneyBillWave /> ${cartTotal/100} </h1>
                <small className='text-center mb-5'>Will ship to: {address}</small>

                <div className='form-group mb-3 w-100'>
                    <h6>Card Number: </h6>
                    <CardNumberElement onChange={handleChange} options={cardStyle} className='stripe-input' />
                </div>

                <div className='form-group mb-3 w-100'>
                    <h6>Expiry: </h6>
                    <CardExpiryElement onChange={handleChange} options={cardStyle} className='stripe-input' />
                </div>

                <div className='form-group mb-3 w-100'>
                    <h6>CVC: </h6>
                    <CardCvcElement onChange={handleChange} options={cardStyle} className='stripe-input' />
                </div>

                <div className='text-center mt-3'>
                    {
                        disabled
                        &&
                        <small style={{fontSize: `0.75rem`}} className='text-muted'>Please, fill in all fields above before payment</small>
                    }
                    <button 
                        className='stripe-button'
                        disabled={processing || disabled || succeeded}
                    >
                        <span id='button-text'>
                            {processing ? 'Processing...' : 'Pay'}            
                        </span>
                    </button>
                </div>

                {error && <p className='card-error text-center mt-3 text-danger'>{error}</p>}
                {succeeded && <p className='card-success text-center mt-3 text-info'>Payment Successful</p>}
            </form>
        }
    </React.Fragment>
  );
};

export default StripeCheckout;
