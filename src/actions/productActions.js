//CREATE PRODUCT
export const createProduct = async (values, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/products/createproduct`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify(values)
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)}
    })
}



//GET ALL (+FILTER and PAGINATION)
export const getProducts = (values) => {
    //get a query string from values    (`category=52&title=null`   from   `{category: 52, title: ''})
    const valuesToString = () => {
        let valuesString = '';
        for (let key in values) {
            if (values[key] === '') values[key] = null; //convert empty strings to null
            valuesString += `${key.toString()}=${values[key]}&` //convert to:   `key=value&key2=value2&...`
        }
        valuesString = valuesString.slice(0, -1); //remove the last `&` from string
        return valuesString
    }
    
    return fetch(`${process.env.REACT_APP_API}/products/getproducts?${valuesToString()}`)
        .then(res => {
            return res.json()
        })
        .catch(err => {
            return {error: JSON.stringify(err)}
        })
}



//PRODUCT BY SLUG
export const getProductBySlug = slug => {
    return fetch(`${process.env.REACT_APP_API}/products/getproductbyslug?slug=${slug}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        })
}


//UPDATE PRODUCT
export const updateProduct = (values, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/products/updateproduct`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'PUT',
        body: JSON.stringify(values)
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)}
    })
}



//DELETE PRODUCT
export const deleteProduct = (product_id, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/products/deleteproduct`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'DELETE',
        body: JSON.stringify({product_id})
    })
    .then(res => {
        return res.json();
    })
    .catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)}
    })
}



//GET LATEST PRODUCTS
export const getLatestProducts = () => {
    return fetch(`${process.env.REACT_APP_API}/products/getlatestproducts`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        })
}