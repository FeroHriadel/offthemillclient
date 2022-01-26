import React, { useState, useEffect, useRef} from 'react';
import { getOrders } from '../../../actions/orderActions';
import { useSelector } from 'react-redux';
import OrderCard from '../../profile/OrderCard';
import { Spinner, Alert } from 'react-bootstrap';
import OrderSearch from './OrderSearch';



const OrdersIndex = () => {
    //VALUES
    const user = useSelector(state => state.user);
    const [orders, setOrders] = useState(null);
    const isMounted = useRef(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [perPage, setPerPage] = useState(2);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [orderId, setOrderId] = useState(null); //search by order_id value
    const [address, setAddress] = useState(null); // search by address value



    //FETCH INITIAL ORDERS
    const fetchInitialOrders = () => {
        getOrders(null, null, 5, 0, user.usertoken) // use the same perPage & skip values in searchByAddress()
        .then(data => {
            if (data && data.error) {
                setError(`No orders found.`);
                setLoading(false);
            } else {
                setOrders(data.orders);
                setPerPage(data.perPage);
                setSkip(data.skip);
                setTotal(data.total);
                setError('');
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        if (isMounted) {
            fetchInitialOrders();
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //INFINITE SCROLL
    const [loadingMore, setLoadingMore] = useState(false);
    const [canLoadMore, setCanLoadMore] = useState(true);

    useEffect(() => {
        const loadMore = () => {
            let documentHeight = window.document.body.scrollHeight
            let screenHeight = window.innerHeight;
            let scrolled = window.scrollY;
    
            // let newSkip = skip + perPage;
    
            if ((scrolled + screenHeight >= 0.7 * documentHeight) && (total > skip + perPage) && canLoadMore) {
                setCanLoadMore(false);
    
                setLoadingMore(true);
                getOrders(orderId, address, perPage, skip + perPage, user.usertoken)
                    .then(data => {
                        if (data && data.error) {
                            console.log(data.error);
                            setCanLoadMore(true);
                            setLoadingMore(false);
                        } else {
                            setLoadingMore(false);
                            setError('');
                            setTotal(data.total);
                            setSkip(data.skip);
                            setPerPage(data.perPage);
                            setOrders([...orders, ...data.orders]);
                            setCanLoadMore(true);
                        }
                    })                   
            }
        }

        document.addEventListener('scroll', loadMore);

        return () => document.removeEventListener('scroll', loadMore);
    }, [total, perPage, skip, orders, canLoadMore, orderId, address]);



    //SEARCH BY ID 
    //triggered in OrderSearch.js
    const searchById = () => {
        setLoading(true);
        setOrders(null);
        getOrders(orderId, null, 1, 0, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setError(data.error);
                    setLoading(false); 
                } else {
                    setError('');
                    setOrders(data.orders);
                    setError(false);
                    setLoading(false);
                    setOrderId(null);
                    setLoading(false);
                }
            })
    }



    //SEARCH BY ADDRESS
    //triggered in OrderSearch.js
    const searchByAddress = () => {
        setLoading(true);
        setOrders(null);
        getOrders(null, address, 5, 0, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    setOrders(data.orders);
                    setPerPage(data.perPage);
                    setSkip(data.skip);
                    setTotal(data.total);
                    setLoading(false);
                }
            })
    }



    //RENDER
    return (
        <React.Fragment>

            <h4 className='mb-3'>Orders</h4>

            {
                loading
                &&
                <div className='w-100 text-center mt-5'>
                    <Spinner animation='border' />
                </div>
            }

            {
                error
                &&
                <div className='w-100 text-center'>
                    <Alert variant='danger'>{error}</Alert>
                    <p className='text-center' style={{cursor: `pointer`}} onClick={() => window.location.reload()}>Reload</p>
                </div>
            }

            {
                !loading && !error && orders
                &&
                <React.Fragment>
                    <OrderSearch 
                        orderId={orderId} 
                        setOrderId={setOrderId} 
                        address={address} 
                        setAddress={setAddress} 
                        searchById={searchById}
                        searchByAddress={searchByAddress}
                    />
                    <div className='d-flex flex-column align-items-center w-100'>
                        {
                            orders.map(order => (
                                <OrderCard key={`ordercard${order.order_id}`} order={order} />
                            ))
                        }
                    </div>
                </React.Fragment>
            }

            {
                loadingMore
                &&
                <div className='w-100 text-center mt-5'>
                    <Spinner animation='border' />
                </div>
            }


        </React.Fragment>
    );
};

export default OrdersIndex;
