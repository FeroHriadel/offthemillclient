export const addToWishlist = (product_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/wishlist/addtowishlist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({product_id})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}



//GET USER'S WISHLIST
export const getWishlist = usertoken => {
    return fetch(`${process.env.REACT_APP_API}/wishlist/getwishlist`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'GET'
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}



export const removeFromWishlist = (wish_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/wishlist/removefromwishlist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'DELETE',
        body: JSON.stringify({wish_id})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}