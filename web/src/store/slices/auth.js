import { createSlice } from '@reduxjs/toolkit'
const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        role: null,
        profile: null
    },
    reducers: {
        update(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        reset() {
            return {
                token: null,
                role: null,
                profile: null
            }
        }
    },
})
const { actions, reducer } = AuthSlice
export const AuthActions = actions;
export default reducer;