import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfileNav from '../components/profile/ProfileNav';
import { Outlet } from 'react-router-dom';




const Profile = () => {
    const user = useSelector(state => state.user);
    
    return (
        <div className='text-center'>
            <div>
                <ProfileNav />
            </div>

            <div>
                <h1 className='mt-5'>PROFILE</h1>
                <p>{user && user.email && user.email.split('@')[0]}</p>
            </div>

            <div className='container'>
                <Outlet />
            </div>
        </div>
    )
}

export default Profile
