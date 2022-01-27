import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileNav from '../components/profile/ProfileNav';
import { Outlet } from 'react-router-dom';




const Profile = () => {
    //GET USER (to show their name)
    const user = useSelector(state => state.user);



    //WATCH PATHNAME
      //if user clicks link
      const pathname = window.location.pathname;
      const [currentPath, setCurrentPath] = useState(pathname)
  
      useEffect(() => {
          const watchPathname = () => {
              let currentPathname = window.location.pathname;
              setCurrentPath(currentPathname);
          }
  
          window.addEventListener('click', watchPathname);
  
          return () => window.removeEventListener('click', watchPathname);
      }, [currentPath]);
  
        //if user uses the back/forward browser arrow
      useEffect(() => {
          const watchPathname = () => {
              let currentPathname = window.location.pathname;
              setCurrentPath(currentPathname);
          }
  
          window.addEventListener('popstate', watchPathname);
  
          return () => window.removeEventListener('popstate', watchPathname);
      }, []);

    


    //RENDER
    return (
        <div className='text-center'>
            <div>
                <ProfileNav />
            </div>

            <div>
                <h1 className='mt-5'>PROFILE</h1>
                <p>{user && user.email && user.email.split('@')[0]}</p>
                {
                    currentPath == '/profile'
                    ?
                    <p className='mt-5 text-muted'>
                        Check the status of your orders, see and edit your wishlist, or change your password here.
                    </p>
                    :
                    ''
                }
            </div>

            <div className='container'>
                <Outlet />
            </div>
        </div>
    )
}

export default Profile
