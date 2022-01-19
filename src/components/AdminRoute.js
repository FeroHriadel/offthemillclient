import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; //Outlet enables us to render children components
import { useCheckAdmin } from '../hooks/useCheckAdmin'; //a custom hook returning isLoggedIn: true/false



const AdminRoute = () => {
    //useCheckAdmin is just a function that connects to redux state.user and sets isAdmin accordingly.
    //checkingAdmin just buys us time before useCheckAdmin finishes.
    const { isAdmin, checkingAdmin } = useCheckAdmin();
    
    if (checkingAdmin) return <h3>Loading...</h3>
    return isAdmin ? <Outlet /> : <Navigate to='/' /> //if logged in render children. Else redirect.
}

export default AdminRoute
