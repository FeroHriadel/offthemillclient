import { useDispatch } from 'react-redux';



export const useCart = () => {
    //DEFS
    const dispatch = useDispatch();



    //ADD PRODUCT TO CART METHOD
        //helper => add product to cart array
        //expected argument: product = {product_id, price, tags: ['tag1'], images: [http://img.jpg], title, ...}
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



    //RETURN USECART METHODS
    return {addProductToCart, clearCart};
}