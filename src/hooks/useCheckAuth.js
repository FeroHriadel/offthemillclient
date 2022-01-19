import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';



export const useCheckAuth = () => {
    const user = useSelector(state => state.user);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (user && user.email) setIsLoggedIn(true);
        else setIsLoggedIn(false);

        setCheckingAuth(false);
    }, [user]);


    return {isLoggedIn, checkingAuth};
}
