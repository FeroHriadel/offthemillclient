//GET ALL
export const getTags = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/tags/gettags`);
        const data = await res.json();
        
        if (!data || data.error) return {error: data.error ? data.error : 'Something went wrong'};
        return data

    } catch (error) {
        console.log(error);
        return {error: JSON.stringify(error)};
    }
}



//GET BY SLUG
export const getTag = tagSlug => {
    return fetch(`${process.env.REACT_APP_API}/tags/gettag/${tagSlug}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return ({error: JSON.stringify(error)});
        })
}



//CREATE
export const createTag = (name, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/tags/createtag`, {
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
export const updateTag = (newName, tagSlug, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/tags/updatetag/${tagSlug}`, {
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
export const deleteTag = (tagId, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/tags/deletetag/${tagId}`, {
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
export const searchTags = name => {
    return fetch(`${process.env.REACT_APP_API}/tags/searchtags?name=${name}`)
        .then(res => {
            return res.json();
        })
        .catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        });
}