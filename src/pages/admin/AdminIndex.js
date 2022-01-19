import React from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { Outlet } from 'react-router-dom';



const AdminIndex = () => {
    return (
        <div className='row w-100'>
            <div className='col-sm-3'>
                <AdminNav />
            </div>
            
            <div className='col-sm-9 text-center mt-5'>
                <h1>Admin Dashboard</h1>
                <div className='text-center mt-5'>
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

export default AdminIndex
