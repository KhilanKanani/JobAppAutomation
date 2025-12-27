import { createSlice } from '@reduxjs/toolkit'
import FetchCurrentUser from '../fetchUserdata/FetchCurrentUser';

const Userslice = createSlice({
    name: 'user',

    initialState: {
        Loading: true,
        userdata: null,
        history: null
    },

    reducers: {
        setUserdata: (state, action) => {
            state.userdata = action.payload;
            state.Loading = false;
        },

        setLoadings: (state, action) => {
            state.Loading = action.payload;
        },

        setHistory: (state, action) => {
            state.history = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(FetchCurrentUser.pending, (state) => {
                state.Loading = true
            })

            .addCase(FetchCurrentUser.fulfilled, (state, action) => {
                state.userdata = action.payload
                state.Loading = false;
            })

            .addCase(FetchCurrentUser.rejected, (state) => {
                state.Loading = false;
            });
    }
})

export const { setUserdata, setLoadings, setHistory } = Userslice.actions
export default Userslice.reducer