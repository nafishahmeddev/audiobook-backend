import { createSlice } from '@reduxjs/toolkit'
const ObjectDialogSlice = createSlice({
    name: 'objectDialog',
    initialState: {
        isDialogOpen: false,
        payload: [],
        options: {
            expanded: false
        }
    },
    reducers: {
        setOptions(state, action) {
            state.options = action.payload
        },
        openDialog(state, action) {
            state.isDialogOpen = true;
            state.payload = action.payload
        },
        closeDialog(state) {
            state.isDialogOpen = false;
            state.options = {
                expanded: false
            }
            state.payload = [];
        }
    },
})
const { actions, reducer } = ObjectDialogSlice
export const ObjectDialogActions = actions;
export default reducer;