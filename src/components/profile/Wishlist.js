import React, { useRef, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { getWishlist } from '../../actions/wishlistActions';
import { Spinner } from 'react-bootstrap';
import WishlistItem from './WishlistItem';
import { removeFromWishlist } from '../../actions/wishlistActions';
import ToastMessage from '../ToastMessage';



const Wishlist = () => {
    const user = useSelector(state => state.user);
    const isMounted = useRef(true);
    const [error, setError] = useState('');
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);



    //GET WISHLIST
    useEffect(() => {
        if (isMounted) {
            getWishlist(user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setError(data.error);
                        setLoading(false);
                    } else {
                        setProducts(data.products);
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
    const [bgColor, setBgColor] = useState(gray);



    //REMOVE WISHLIST ITEM
    const [wishToRemove, setWishToRemove] = useState(null);

    useEffect(() => {
        if (isMounted && wishToRemove) {
            removeFromWishlist(wishToRemove, user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setBgColor(red);
                        setToastText(data.error);
                        setShowToast(true);
                        setWishToRemove(null);
                        setTimeout(() => {setShowToast(false)}, 2500);
                    } else {
                        let existingProducts = [...products];
                        existingProducts = existingProducts.filter(p => p.wish_id !== wishToRemove);
                        setProducts(existingProducts);
                        setBgColor(gray);
                        setToastText('Removed');
                        setShowToast(true);
                        setWishToRemove(null);
                        setTimeout(() => {setShowToast(false)}, 2000);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, wishToRemove])



    //RENDER
    return (
        <div className='container'>
            <h4 className='text-center my-5'>My Wishlist</h4>

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
                <div className='w-100 text-center'>
                    <p>{error}</p>
                </div>
            }

            {
                !loading && !error && products
                &&
                <div className='row w-100 mb-5 g-0'>
                    {products.map(product => (
                        <div className='col-md-6' key={`wishlistitem${product.product_id}`}>
                            <WishlistItem  product={product} setWishToRemove={setWishToRemove} />
                        </div>
                    ))}
                </div>
            }

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </div>
    )
};

export default Wishlist;
