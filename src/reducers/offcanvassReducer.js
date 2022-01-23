export function offcanvassReducer(state = false, action) {
    switch (action.type) {
        case 'TOGGLE_OFFCANVASS':
            return action.payload;
        default:
            return state;
    }
}