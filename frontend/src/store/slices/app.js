import { createSlice } from '@reduxjs/toolkit'
const AppSlice = createSlice({
    name: 'app',
    initialState: {
        isDrawerOpen: false
    },
    reducers: {
        openDrawer(state) {
            state.isDrawerOpen = true;
        },
        closeDrawer(state) {
            state.isDrawerOpen = false;
        }
    },
})
const { actions, reducer } = AppSlice
export const AppActions = actions;
export default reducer;