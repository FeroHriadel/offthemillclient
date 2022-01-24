import { combineReducers } from "redux";
import { cartReducer } from "./cartReducer";
import { userReducer } from './userReducer';
import { offcanvassReducer } from './offcanvassReducer';
import { addressReducer } from "./addressReducer";



export const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    showOffcanvass: offcanvassReducer,
    address: addressReducer
});