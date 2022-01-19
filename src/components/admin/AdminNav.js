import React from 'react';
import { useNavigate } from 'react-router-dom';



const AdminNav = () => {
    const navigate = useNavigate();


    return (
        <nav>
            <ul className='admin-nav'>
                <li onClick={() => navigate('/admin/products')}>Products</li>
                <li onClick={() => navigate('/admin/categories')}>Categories</li>
                <li onClick={() => navigate('/admin/tags')}>Tags</li>
                <li onClick={() => navigate('/admin/orders')}>Orders</li>
            </ul>
        </nav>
    )
}

export default AdminNav
