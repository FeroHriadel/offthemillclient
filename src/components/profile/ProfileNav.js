import React from 'react';
import { Link } from 'react-router-dom';



const ProfileNav = () => {
    return (
        <nav className='mt-2'>
            <ul className='nav d-fle justify-content-center'>
                <li className='nav-item mb-2'>
                    <Link to='/profile/changepassword' className='profile-nav-link'>Change Password</Link>
                </li>

                <li className='nav-item mb-2'>
                    <Link to='/profile/purchasehistory' className='profile-nav-link'>Purchase History</Link>
                </li>

                <li className='nav-item mb-2'>
                    <Link to='/profile/wishlist' className='profile-nav-link'>My Wishlist</Link>
                </li>
            </ul>
        </nav>
    )
}

export default ProfileNav
