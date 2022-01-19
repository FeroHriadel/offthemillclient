import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';
import { getUserAndToken } from './actions/userActions';



//middleware
const middleware = [thunk];



//initial state
const savedUser = getUserAndToken();
const initialState = savedUser ? savedUser : {user: null};



//create store
const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
