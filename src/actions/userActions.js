import cookie from 'js-cookie';



//PRE-SIGNUP (sends email & password to api, api responds with email with client link where we confirm registration)
export const preSignup = async (email, password) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/presignup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {error: JSON.stringify(error)};
    }
}



//HELPERS ( save userDetails in LS and token in cookies )
  //set cookie
export const setCookie = (key, value) => {
    cookie.set(key, value);
}

  //get cookie
export const getCookie = (key) => {
    return cookie.get(key);
}

  //remove cookie
export const removeCookie = (key) => {
    cookie.remove(key);
}

  //save user in LS & token in cookies
export const saveUserAndToken = (user, token) => {
    setCookie('usertoken', token);
    localStorage.setItem('user', JSON.stringify(user));
}

  //remove user from LS & token from cookies
export const removeUserAndToken = () => {
    removeCookie('usertoken');
    localStorage.removeItem('user');
}

  //get user from LS & token from cookies
export const getUserAndToken = () => {
    const isCookie = getCookie('usertoken');
    if (isCookie) {
        if (localStorage.getItem('user')) {
            return {user: {...JSON.parse(localStorage.getItem('user')), usertoken: isCookie}}
        }
    }

    return false;
}



//SIGNUP (sends token from params (with email & password) to API. API sends cookie and usertoken with user_id in it)
export const signup = (token) => async dispatch => { //we have access to dispatch bc we installed thunk. The procedure when using redux in you actions is to make your action return a function and that function can get dispatch thanx to thunk.
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        });

        const data = await res.json();
        if (!data || data.error) {
            dispatch({
                type: 'LOG_IN_FAIL',
                payload: data.error ? {error: data.error} : {error: 'Something went wrong. Please try again later'}
            });
        } else {
            saveUserAndToken(data.user, data.usertoken);
            dispatch({
                type: 'LOG_IN',
                payload: {...data.user, usertoken: data.usertoken}
            });
        }
        
    } catch (error) {
        console.log(error);
        dispatch({type: 'LOG_IN_FAIL', payload: {error: JSON.stringify(error)}});
    }
}



//SIGNOUT (clears cookie, LS, and user in redux)
export const signout = () => async dispatch => {
    try {
        removeUserAndToken();
        dispatch({type: 'LOG_OUT', payload: {}})
        
    } catch (error) {
        console.log(error);
    }
}



//SIGNIN ( sends email and password to API. API sends cookie and usertoken with user_id in it)
export const signin = (email, password) => async dispatch => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/signin`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({email, password})
        });

        const data = await res.json();
        if (!data || data.error) {
            dispatch({
                type: 'LOG_IN_FAIL',
                payload: data.error ? {error: data.error} : {error: 'Something went wrong.'}
            });
        } else {
            saveUserAndToken(data.user, data.usertoken);
            dispatch({
                type: 'LOG_IN',
                payload: {...data.user, usertoken: data.usertoken}
            });
        }

    } catch (error) {
        console.log(error);
        dispatch({type: 'LOG_IN_FAIL', payload: {error: JSON.stringify(error)}});
    }
}



//GET SIGNED-IN USER'S DETAILS
export const getSignedInUser = async (token) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/getsignedinuser`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'GET',
        });

        const data = await res.json();
        return data
        // if (!data || !data.error) {
        //     return data.error ? {error: data.error} : {error: 'Something went wrong'}
        // } else {
        //     return data
        // }

    } catch (error) {
        return {error: JSON.stringify(error)};
    }
}



//GET GOOGLE CLIENT ID
export const getGoogleClientId = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/getgoogleclientid`);
        const data = await res.json();
        return data;
        
    } catch (error) {
        console.log(error);
        return ({error: JSON.stringify(error)});
    }
}



//SIGNIN WITH GOOGLE
export const signinWithGoogle = (user) => async (dispatch) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/signinwithgoogle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();
        if (!data || data.error) {
            dispatch({
                type: 'LOG_IN_FAIL',
                payload: data.error ? {error: data.error} : {error: 'Something went wrong.'}
            });
        } else {
            saveUserAndToken(data.user, data.usertoken);
            dispatch({
                type: 'LOG_IN',
                payload: {...data.user, usertoken: data.usertoken}
            });
        }
        
    } catch (error) {
        console.log(error);
        dispatch({type: 'LOG_IN_FAIL', payload: {error: JSON.stringify(error)}});
    }
}



//FORGOT PASSWORD
export const forgotPassword = async email => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/forgotpassword`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({email})
        });

        const data = await res.json();
        if (!data || data.error) {
            return data.error ? {error: data.error} : {error: `Something went wrong`}
        } else {
            return data
        }

    } catch (error) {
        console.log(error);
        return {error: JSON.stringify(error)}
    }
}



//RESET PASSWORD
export const resetPassword = async (resettoken, newPassword) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API}/users/resetpassword`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({resettoken, newPassword})
        });

        const data = await res.json();
        if (!data || data.error) {
            return data.error ? {error: data.error} : {error: `Something went wrong`};
        } else {
            return {message: data.message}
        }

    } catch (error) {
        console.log(error);
        return {error: JSON.stringify(error)}
    }
}



//CHANGE PASSWORD
export const changePassword = (newPassword, usertoken) => {
    return fetch(`${process.env.REACT_APP_API}/users/changepassword`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        method: 'PUT',
        body: JSON.stringify({newPassword})
    }).then(res => {
        return res.json()
    }).catch(error => {
        console.log(error);
        return {error: JSON.stringify(error)}
    })
}