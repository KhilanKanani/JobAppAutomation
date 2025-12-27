import { configureStore } from '@reduxjs/toolkit'
import userdata from '../redux/Userslice'

export const store = configureStore({
    reducer: {
        user: userdata,
    }
})