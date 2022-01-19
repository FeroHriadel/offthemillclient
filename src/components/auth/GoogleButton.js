import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { Button } from 'react-bootstrap';
import { signinWithGoogle } from '../../actions/userActions';
import { useSelector, useDispatch } from 'react-redux';



const GoogleButton = ({ googleClientId }) => {
    //VARS AND DEFS
    const [blockBtn, setBlockBtn] = useState(false); //figure out how to block gglBtn after click
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    

    //ON GOOGLEBTN CLICK
    const responseGoogle = response => {
        const tokenId = response.tokenId;
        const user = {tokenId}; //called it `user` as tokenId has user details in it. But it will get passed to API call as {tokenId}
        //console.log(user);  //will give you: {tokenId: 'eyJhb...'}

        dispatch(signinWithGoogle(user));
        //success or error are handled in parent (<LoginForm />)
    }


    return (
        <div className='google-btn-wrapper'>
            <GoogleLogin
                clientId={googleClientId}
                buttonText='Log in with Google'
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={(renderProps) => ( //this is how you can style the btn
                    <Button
                        variant='primary'
                        className='btn col-12'
                        onClick={renderProps.onClick}
                        style={{
                            marginTop: '0.75rem'
                        }}
                    >
                        Log in with Google
                    </Button>
                )}
            >
            
            </GoogleLogin>
        </div>
    )
}

export default GoogleButton
