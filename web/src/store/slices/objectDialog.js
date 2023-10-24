import { createSlice } from '@reduxjs/toolkit'
const ObjectDialogSlice = createSlice({
    name: 'objectDialog',
    initialState: {
        isDialogOpen: false,
        payload : []
    },
    reducers: {
        openDialog(state, action) {
            state.isDialogOpen = true;
            state.payload = action.payload
        },
        closeDialog(state) {
            state.isDialogOpen = false;
            state.payload = [];
        }
    },
})
const { actions, reducer } = ObjectDialogSlice
export const ObjectDialogActions = actions;
export default reducer;