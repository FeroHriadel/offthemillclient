//react imports
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

//react-router-dom imports
import { BrowserRouter } from 'react-router-dom';

//redux imports
import { Provider } from 'react-redux';
import store from './store';

//style imports
import './styles/bootstrap.min.css';
import './styles/index.scss';



//render with redux & router
render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>, 
    document.getElementById('root')
);



