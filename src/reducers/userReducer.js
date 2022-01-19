export function userReducer(state = {}, action) {
    switch (action.type) {
        case 'LOG_IN':
            return action.payload;
        case 'LOG_IN_FAIL':
            return action.payload;
        case 'LOG_OUT':
            return action.payload;
        default:
            return state;
    }
}