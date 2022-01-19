import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';



export const useCheckAdmin = () => {
    const user = useSelector(state => state.user);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);

    useEffect(() => {
        if (user && user.role === 'admin') setIsAdmin(true);
        else setIsAdmin(false);

        setCheckingAdmin(false);
    }, [user]);


    return {isAdmin, checkingAdmin};
}