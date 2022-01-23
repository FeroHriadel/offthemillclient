import { combineReducers } from "redux";
import { cartReducer } from "./cartReducer";
import { userReducer } from './userReducer';
import { offcanvassReducer } from './offcanvassReducer';



export const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    showOffcanvass: offcanvassReducer
});