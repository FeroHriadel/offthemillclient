import React from 'react'
import { Route, Routes } from 'react-router-dom';

//auth
import MainNav from './MainNav';
import Home from '../pages/Home';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Activate from '../pages/auth/Activate';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

//profile
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import PasswordUpdateForm from './profile/PasswordUpdateForm'; //nested

//admin
import AdminRoute from './AdminRoute';
import AdminIndex from '../pages/admin/AdminIndex';

//admin - categories
import CategoriesIndex from './admin/categories/CategoriesIndex';
import CreateCategory from './admin/categories/CreateCategory';
import AllCategories from './admin/categories/AllCategories';
import EditCategory from './admin/categories/EditCategory';

//admin - tags
import TagsIndex from './admin/tags/TagsIndex';
import CreateTag from './admin/tags/CreateTag';
import AllTags from './admin/tags/AllTags';
import EditTag from './admin/tags/EditTag';

//admin - products
import ProductsIndex from './admin/products/ProductsIndex';
import CreateProduct from './admin/products/CreateProduct';
import AllProducts from './admin/products/AllProducts';
import EditProduct from './admin/products/EditProduct';

//products
import ProductDetails from '../pages/ProductDetails';
import ProductsByCategory from '../pages/ProductsByCategory';
import ProductsByTag from '../pages/ProductsByTag';
import ProductsSearch from '../pages/ProductsSearch';



const App = () => {
    return (
        <React.Fragment>
            <MainNav />

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/activate/:token' element={<Activate />} />

                <Route path='/profile/*' element={<PrivateRoute/>}>
                    <Route path='/profile/*' element={<Profile />}>
                        <Route path='changepassword' element={<PasswordUpdateForm />} />
                    </Route>
                </Route>

                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/resetpassword/:resettoken' element={<ResetPassword />} />

                <Route path='/admin/*' element={<AdminRoute />} >
                    <Route path='/admin/*' element={<AdminIndex />}>
                        <Route path='categories' element={<CategoriesIndex />} />
                        <Route path='categories/create' element={<CreateCategory />} />
                        <Route path='categories/all' element={<AllCategories />} />
                        <Route path='categories/edit/:slug' element={<EditCategory />} />

                        <Route path='tags' element={<TagsIndex />} />
                        <Route path='tags/create' element={<CreateTag />} />
                        <Route path='tags/all' element={<AllTags />} />
                        <Route path='tags/edit/:slug' element={<EditTag />} />

                        <Route path='products' element={<ProductsIndex />} />
                        <Route path='products/create' element={<CreateProduct />} />
                        <Route path='products/all' element={<AllProducts />} />
                        <Route path='products/edit/:slug' element={<EditProduct />} />
                    </Route>
                </Route>

                <Route path='products/:slug' element={<ProductDetails />} />
                <Route path='products/category/:slug' element={<ProductsByCategory />} />
                <Route path='products/tag/:slug' element={<ProductsByTag />} />
                <Route path='products/all' element={<ProductsSearch />} />

            </Routes>
        </React.Fragment>
    )
}

export default App
