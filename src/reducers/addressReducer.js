//User's address that they type in '/checkout'

export function addressReducer(state = '', action) {
    switch (action.type) {
        case 'CHANGE_ADDRESS':
            return action.payload;
        default:
            return state;
    }
}