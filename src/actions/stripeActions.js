export const createPaymentIntent = (usertoken, address, cartTotal) => {
    return fetch(`${process.env.REACT_APP_API}/stripe/createpaymentintent`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({address, cartTotal})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)};
    })
}