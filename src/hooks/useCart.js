import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';



export const useCart = () => {
    //DEFS
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);



    //GET CART ITEMS COUNT
    const [itemsCount, setItemsCount] = useState(0);
    useEffect(() => {
        if (!cart || cart.length === 0) setItemsCount(0);
        else {
            let count = 0;
            cart.forEach(product => count += product.inCart)
            setItemsCount(count);
        }
    }, [cart])






    //ADD PRODUCT TO CART METHOD
        //helper => add product to cart array
        //expected argument: product = {product_id, title, price, brand, images: [http://img.jpg], ...}
        const addItem = ({ product_id, title, price, brand, images }) => {
            let existingProducts = localStorage.getItem('cart');

            if (existingProducts) {
                existingProducts = JSON.parse(existingProducts);

                if (existingProducts.length === 0) existingProducts.push({
                    product_id, 
                    title, 
                    price,
                    brand,
                    images,
                    inCart: 1
                })

                else {
                    let isDuplicate = false;

                    for (let i = 0; i < existingProducts.length; i++) {
                        if (Number(existingProducts[i].product_id) === Number(product_id)) {
                            existingProducts[i].inCart++;
                            isDuplicate = true;
                            break;
                        }
                    }

                    if (!isDuplicate) existingProducts.push({product_id, title, price, brand, images, inCart: 1});
                }
            } else {
                existingProducts = [{product_id, title, price, brand, images, inCart: 1}]
            }

            return existingProducts
        }

        //helper => add product to LS
        let newCartItems;
        const addItemToLS = (product) => {
            newCartItems = addItem(product);
            localStorage.setItem('cart', JSON.stringify(newCartItems));
        }

        //helper => add product to Redux
        const addItemToRedux = product => {
            dispatch({type: 'ADD_TO_CART', payload: newCartItems});
        }

    //main method => update cart and send to LS & Redux
    const addProductToCart = product => {
        addItemToLS(product);
        addItemToRedux(product);
    }



    //CLEAR CART
    const clearCart = () => {
        localStorage.setItem('cart', JSON.stringify([]));
        dispatch({type: 'CLEAR_CART'});
    }



    //REMOVE ONE FROM CART
    const subtractOne = product_id => {      
        if (!cart || cart.length === 0) return;
        
        const idx = cart.findIndex(product => product.product_id === product_id);
        if (idx === -1) return

        let newCart = [...cart];
        if (newCart[idx].inCart === 1) newCart.splice(idx, 1);
        else newCart[idx].inCart = newCart[idx].inCart - 1;

        localStorage.setItem('cart', JSON.stringify(newCart));
        dispatch({type: 'SUBTRACT_ONE', payload: newCart});
    }




    //RETURN USECART METHODS
    return {addProductToCart, clearCart, itemsCount, subtractOne};
}