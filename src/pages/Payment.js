import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckout from '../components/StripeCheckout';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaBackward } from 'react-icons/fa';



//this must be outside the function so we do not recreate the object on rerender
const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);



const Payment = () => {
  const navigate = useNavigate();

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

        <h1 className='text-center my-5'>PAYMENT</h1>
      
        <div className='w-100 d-flex justify-content-center'>
          <Elements stripe={promise}>
              <StripeCheckout />
          </Elements>
        </div>

      </div>
  );
};

export default Payment;
