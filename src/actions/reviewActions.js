//GET ALL REVIEWS FOR A PRODUCT
export const getReviews = product_id => {
    return fetch(`${process.env.REACT_APP_API}/reviews/getreviews?product_id=${product_id}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            return {error: JSON.stringify(error)}
        })
}



//CREATE REVIEW
export const createReview = (values, product_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/reviews/createreview`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({...values, product_id })
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)}
    })
}