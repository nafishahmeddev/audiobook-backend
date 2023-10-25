import { createSlice } from '@reduxjs/toolkit'
const PreloaderSlice = createSlice({
    name: 'preloader',
    initialState: {
        show: false,
        label: undefined
    },
    reducers: {
        show(state, action) {
            state.show = true;
            state.label = action.payload?.label
        },
        hide(state) {
            state.show = false;
            state.label = "";
        }
    },
})
const { actions, reducer } = PreloaderSlice
export const PreloaderActions = actions;
export default reducer;