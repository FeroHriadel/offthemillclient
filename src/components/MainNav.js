import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../actions/userActions';



const MainNav = () => {
    //REDUX STUFF
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);



    //WATCH IF USER LOGGED IN
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    useEffect(() => {
        if (user && user.email) setUserLoggedIn(user.role);
        else setUserLoggedIn(false);
    }, [user])



    //SIGNOUT
    const logout = () => {
        dispatch(signout());
    }


    //RENDER
    return (
        <Navbar bg="dark" variant='dark' expand="md" className='w-100 d-flex'>
            <Navbar.Brand style={{marginLeft: `1rem`}}>
                <Link to='/' className='main-nav-link'>OFF the MILL</Link>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginRight: '1rem'}} />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-end" style={{width: '100%', marginLeft: '1rem'}}>
                    {
                        userLoggedIn
                        &&
                        <React.Fragment>
                            <Nav.Item>
                                <NavDropdown title='Me' id="basic-nav-dropdown">
                                    <div className='main-nav-dropdown-item'>
                                        <Link to='/profile' style={{textDecoration: 'none'}}>Profile</Link>
                                    </div>

                                    <div className='main-nav-dropdown-item'>
                                        <p onClick={logout} style={{marginBottom: '0'}}>Log out</p>
                                    </div>

                                    {
                                        userLoggedIn === 'admin'
                                        &&
                                        <React.Fragment>
                                            <NavDropdown.Divider />

                                            <div className='main-nav-dropdown-item'>
                                                <Link to='/admin' style={{textDecoration: 'none'}}>Admin Dashboard</Link>
                                            </div>
                                        </React.Fragment>
                                    }
                                </NavDropdown>
                            </Nav.Item>

                            <Nav.Item>
                                <p onClick={logout} className='main-nav-link' style={{marginTop: '0.7rem'}}>Log out</p>
                            </Nav.Item>
                        </React.Fragment>
                        
                    }

                    {
                        !userLoggedIn
                        &&
                        <React.Fragment>
                            <Nav.Item>
                                <Link to='/register' className='main-nav-link'>Register</Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Link to='/login' className='main-nav-link'>Log in</Link>
                            </Nav.Item>
                        </React.Fragment>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default MainNav


/*
        <Navbar bg="dark" variant='dark' expand="md" style={{margin: `0`, boxSizing: `border-box`, maxWidth: `100vw`, overflowY: 'hidden'}}>
            <Navbar.Brand>
                <Link to='/' className='main-nav-link'>OFF the MILL</Link>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav" style={{background: `red`, maxWidth: `260px`}}>
                <Nav>
                    {
                        userLoggedIn
                        &&
                        <React.Fragment>
                            <Nav.Item>
                                <NavDropdown title='Me' id="basic-nav-dropdown">
                                    <div className='main-nav-dropdown-item'>
                                        <Link to='/profile' style={{textDecoration: 'none'}}>Profile</Link>
                                    </div>

                                    <div className='main-nav-dropdown-item'>
                                        <p onClick={logout} style={{marginBottom: '0'}}>Log out</p>
                                    </div>

                                    {
                                        userLoggedIn === 'admin'
                                        &&
                                        <React.Fragment>
                                            <NavDropdown.Divider />

                                            <div className='main-nav-dropdown-item'>
                                                <Link to='/admin' style={{textDecoration: 'none'}}>Admin Dashboard</Link>
                                            </div>
                                        </React.Fragment>
                                    }
                                </NavDropdown>
                            </Nav.Item>

                            <Nav.Item>
                                <p onClick={logout} className='main-nav-link' style={{marginTop: '0.7rem'}}>Log out</p>
                            </Nav.Item>
                        </React.Fragment>
                        
                    }

                    {
                        !userLoggedIn
                        &&
                        <React.Fragment>
                            <Nav.Item>
                                <Link to='/register' className='main-nav-link'>Register</Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Link to='/login' className='main-nav-link'>Log in</Link>
                            </Nav.Item>
                        </React.Fragment>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
*/