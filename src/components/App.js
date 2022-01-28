import React, { useContext, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

//auth
const MainNav = lazy(() => import('./MainNav'));
const Home = lazy(() => import('../pages/Home'));
const Register = lazy(() => import('../pages/auth/Register'));
const Login = lazy(() => import('../pages/auth/Login'));
const Activate = lazy(() => import('../pages/auth/Activate'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

//profile
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const Profile = lazy(() => import('../pages/Profile'));
const PasswordUpdateForm = lazy(() => import('./profile/PasswordUpdateForm'));
const PurchaseHistory = lazy(() => import('./profile/PurchaseHistory'));
const Wishlist = lazy(() => import('./profile/Wishlist'));

//admin
const AdminRoute = lazy(() => import('./AdminRoute'));
const AdminIndex = lazy(() => import('../pages/admin/AdminIndex'));

//admin - categories
const CategoriesIndex = lazy(() => import('./admin/categories/CategoriesIndex'));
const CreateCategory = lazy(() => import('./admin/categories/CreateCategory'));
const AllCategories = lazy(() => import('./admin/categories/AllCategories'));
const EditCategory = lazy(() => import('./admin/categories/EditCategory'));

//admin - tags
const TagsIndex = lazy(() => import('./admin/tags/TagsIndex'));
const CreateTag = lazy(() => import('./admin/tags/CreateTag'));
const AllTags = lazy(() => import('./admin/tags/AllTags'));
const EditTag = lazy(() => import('./admin/tags/EditTag'));

//admin - products
const ProductsIndex = lazy(() => import('./admin/products/ProductsIndex'));
const CreateProduct = lazy(() => import('./admin/products/CreateProduct'));
const AllProducts = lazy(() => import('./admin/products/AllProducts'));
const EditProduct = lazy(() => import('./admin/products/EditProduct'));

//admin - orders
const OrdersIndex = lazy(() => import('./admin/orders/OrdersIndex'));

//products
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const ProductsByCategory = lazy(() => import('../pages/ProductsByCategory'));
const ProductsByTag = lazy(() => import('../pages/ProductsByTag'));
const ProductsSearch = lazy(() => import('../pages/ProductsSearch'));

//cart
const Cart = lazy(() => import('../pages/Cart'));
const CartOffcanvass = lazy(() => import('./cart/Offcanvass'));

//checkout
const Checkout = lazy(() => import('../pages/Checkout'));
const Payment = lazy(() => import('../pages/Payment'));
const PayOnDelivery = lazy(() => import('../pages/PayOnDelivery'));



const App = () => {
    return (
        <Suspense fallback={
            <h1 style={{marginTop: '3rem', width: `100%`, textAlign: 'center'}}>
                Getting your goodies...
            </h1>
        }>
            <MainNav />
            <CartOffcanvass />

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/activate/:token' element={<Activate />} />

                <Route path='/profile/*' element={<PrivateRoute/>}>
                    <Route path='/profile/*' element={<Profile />}>
                        <Route path='changepassword' element={<PasswordUpdateForm />} />
                        <Route path='purchasehistory' element={<PurchaseHistory />} />
                        <Route path='wishlist' element={<Wishlist />} />
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

                        <Route path='orders' element={<OrdersIndex />} />
                    </Route>
                </Route>

                <Route path='products/:slug' element={<ProductDetails />} />
                <Route path='products/category/:slug' element={<ProductsByCategory />} />
                <Route path='products/tag/:slug' element={<ProductsByTag />} />
                <Route path='products/all' element={<ProductsSearch />} />

                <Route path='/cart' element={<Cart />} />

                <Route path='/checkout/*' element={<PrivateRoute/>}>
                    <Route path='/checkout/*' element={<Checkout />} />
                </Route>

                <Route path='/payment/*' element={<PrivateRoute/>}>
                    <Route path='/payment/*' element={<Payment />} />
                </Route>

                <Route path='/payondelivery/*' element={<PrivateRoute/>}>
                    <Route path='/payondelivery/*' element={<PayOnDelivery />} />
                </Route>

            </Routes>
        </Suspense>
    )
}

export default App
