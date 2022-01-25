//CREATE ORDER
export const createOrder = (address, cart, cartTotal, paymentIntent, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/orders/createorder`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({address, cart, cartTotal, paymentIntent})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}



//GET USER'S ORDERS
export const getUsersOrders = usertoken => {
    return fetch(`${process.env.REACT_APP_API}/orders/getusersorders`, {
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

