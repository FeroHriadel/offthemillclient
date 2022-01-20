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



//GET REVIEW (BY ID)
export const getReview = review_id => {
    return fetch(`${process.env.REACT_APP_API}/reviews/getreview?review_id=${review_id}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            return {error: JSON.stringify(error)}
        })
}



//UPDATE REVIEW
export const updateReview = (stars, comment, review_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/reviews/updatereview`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'PUT',
        body: JSON.stringify({stars, comment, review_id})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)}
    })
}



//DELETE REVIEW
export const deleteReview = (review_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/reviews/deletereview`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'DELETE',
        body: JSON.stringify({review_id})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        return {error: JSON.stringify(error)}
    });
}