import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';



const CartTable = () => {
    //VALUES
    const cart = useSelector(state => state.cart);
    const { addProductToCart, subtractOne } = useCart();



    //RENDER
    if (cart.length === 0) return <Link to='/products/all' style={{textDecoration: 'none'}}><p className='text-center'>The cart is empty. <span className='text-secondary'>Click here to go back to store</span></p></Link>
    
    return (
        <React.Fragment>
            <div className='table-outline'>
                {/*TABLE HEADER */}
                <div className='cart-table-row cart-table-header'>
                    <div className='cart-table-col'>
                        <h6>Product</h6>
                    </div>
                    <div className='cart-table-col'>
                        <h6>In Cart</h6>
                    </div>
                    <div className='cart-table-col'>
                    <h6>Price</h6>
                    </div>
                </div>


                {/*TABLE ROWS */}
                {
                    cart.map(product => (
                        <div className='cart-table-row' key={product.product_id}>
                            <div className='cart-table-col'>
                                <div 
                                    className='product-thumbnail'
                                    style={{width: `60px`, minWidth: `60px`, height: `60px`, background: product.images[0] == null ? `linear-gradient(to bottom left, #eee, #ccc)` : `url(${product.images[0]}) no-repeat center center/cover`}}
                                />
                                <p className='product-name'>{product.title}</p>
                            </div>

                            <div className='cart-table-col'>
                                <div className='in-cart-inner-wrapper'>
                                    <p>{product.inCart}</p>
                                    <div className='arrows-wrapper'>
                                        <p onClick={() => addProductToCart(product)}><FaSortUp /></p>
                                        <p onClick={() => subtractOne(product.product_id)}><FaSortDown /></p>
                                    </div>
                                </div>
                            </div>

                            <div className='cart-table-col'>
                                <p>{product.inCart} x ${product.price/100}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            

            {/* SUMMARY */}
            <h4 className='mt-5'>TOTAL: ${cart.reduce((acc, curr) => {
                acc += curr.inCart * curr.price/100
                return acc;
            }, 0)}</h4>
        </React.Fragment>
    )
}

export default CartTable;
