const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

export function cartReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TO_CART':
            return action.payload;
        case 'SUBTRACT_ONE':
            return action.payload;
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
}