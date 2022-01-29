import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { Outlet } from 'react-router-dom';
import Meta  from '../../components/Meta';



const AdminIndex = () => {
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



    //RENER
    return (
        <div className='row w-100 g-0'>
            <Meta title='Off the Mill | Admin' />

            <div className='col-sm-3 g-0'> {/* Don't remove g-0, will cause width problems on sm screen */}
                <AdminNav />
            </div>
            
            <div className='col-sm-9 text-center mt-5 g-0' style={{paddingLeft: `2.5%`, paddingRight: `2.5%`}}>
                <h1>Admin Dashboard</h1>

                {
                    currentPath == '/admin'
                    ?
                    <p className='text-center mt-5'>
                        Create, edit, delete Tags, Categories, Products, and manage Orders.
                    </p>
                    :
                    ''
                }

                <div className='text-center mt-5'>
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

export default AdminIndex
