//CREATE ORDER
export const createOrder = (address, cart, cartTotal, paymentIntent, paid, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/orders/createorder`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({address, cart, cartTotal, paymentIntent, paid})
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



//UPDATE ORDER STATUS
export const updateStatus = (orderId, newStatus, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/orders/updatestatus`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': `application/json`
        },
        method: 'PUT',
        body: JSON.stringify({orderId, newStatus})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}



//GET ALL ORDERS + FILTER + PAGINATION
export const getOrders = (orderId, address, perPage, skip, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/orders/getorders?orderid=${orderId}&address=${address}&perpage=${perPage}&skip=${skip}`, {
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



//UPDATE ORDER TO PAID
export const updateToPaid = (order_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/orders/updatetopaid?orderid=${order_id}`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'PUT'
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}

