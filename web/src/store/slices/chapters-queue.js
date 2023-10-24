import { createSlice } from '@reduxjs/toolkit'
const ChapterQueuesSlice = createSlice({
    name: 'chapters-queue',
    initialState: {},
    reducers: {
        add(state, action) {
            const key = action.payload.key;
            state[key] = {
                key: key,
                ...action.payload
            }
            return state;
        },
        update(state, action) {
            const key = action.payload.key;
            if (!state[key]) return state;
            state[key] = {
                key: key,
                ...state[key],
                ...action.payload
            }
            return state;
        },
        remove(state, action) {
            const key = action.payload.key;
            delete state[key];
            return state;
        }
    },
})
const { actions, reducer } = ChapterQueuesSlice
export const ChapterQueuesActions = actions;
export default reducer;