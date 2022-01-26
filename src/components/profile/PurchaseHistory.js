import React, { useState, useEffect, useRef } from 'react';
import { getUsersOrders } from '../../actions/orderActions';
import { useSelector } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import OrderCard from './OrderCard';



const PurchaseHistory = () => {
    //VARS
    const user = useSelector(state => state.user);
    const isMounted = useRef(true);
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    //GET USER'S ORDERS
    useEffect(() => {
        if (isMounted) {
            getUsersOrders(user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setError(data.error);
                        setLoading(false);
                    } else {
                        setOrders(data.orders);
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted]);




    //RENDER
    return (
        <div className='container'>
            <h4 className='text-center my-5'>Purchase History</h4>

            {
                loading
                &&
                <div className='w-100 text-center'>
                    <Spinner animation='border' />
                </div>
            }

            {
                error
                &&
                <Alert variant='danger'>{error}</Alert>
            }

            {
                !error && !loading && orders
                &&
                orders.map(order => (
                    <OrderCard key={order.order_id} order={order} />
                ))
            }

            <div className='space-at-the-bottom' style={{height: `3rem`}} />
        </div>
    )

};

export default PurchaseHistory;
