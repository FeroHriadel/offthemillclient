//GET ALL
export const getCategories = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/categories/getcategories`);
        const data = await res.json();
        
        if (!data || data.error) return {error: data.error ? data.error : 'Something went wrong'};
        return data

    } catch (error) {
        console.log(error);
        return {error: JSON.stringify(error)};
    }
}



//GET BY SLUG
export const getCategory = categorySlug => {
    return fetch(`${process.env.REACT_APP_API}/categories/getcategory/${categorySlug}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return ({error: JSON.stringify(error)});
        })
}



//CREATE
export const createCategory = (name, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/categories/createcategory`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'POST',
        body: JSON.stringify({name})
    })
        .then(res => res.json())
        .then(data => {
            return data
        }).catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        })
}



//EDIT
export const updateCategory = (newName, categorySlug, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/categories/updatecategory/${categorySlug}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'PUT',
        body: JSON.stringify({newName})
    }).then(res => {
        return res.json();
    }).catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)};
    })
}



//DELETE BY ID
export const deleteCategory = (categoryId, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/categories/deletecategory/${categoryId}`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'DELETE',
    }).then(res => {
        return res.json();
    }).catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)}
    })
}



//SEARCH BY NAME
export const searchCategories = name => {
    return fetch(`${process.env.REACT_APP_API}/categories/searchcategories?name=${name}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        });
}