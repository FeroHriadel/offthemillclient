import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; //Outlet enables us to render children components
import { useCheckAuth } from '../hooks/useCheckAuth'; //a custom hook returning isLoggedIn: true/false



const PrivateRoute = () => {
    //useCheckAuth is just a function that connects to redux state.user and sets isLoggedIn accordingly.
    //checkingAuth just buys us time before useCheckAuth finishes.
    const { isLoggedIn, checkingAuth } = useCheckAuth();
    
    if (checkingAuth) return <h3>Loading...</h3>
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' /> //if logged in render children. Else redirect.
}

export default PrivateRoute
