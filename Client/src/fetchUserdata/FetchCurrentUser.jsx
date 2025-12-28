import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SERVER_URL } from "../main";

const FetchCurrentUser = createAsyncThunk('user/currentUser', async () => {
    try {
        const result = await axios.get(`${SERVER_URL}/api/user/currentUser`, { withCredentials: true });
        return result.data;
    }

    catch (err) {
        console.log('FindCurrentUser Error :', err.message);
    }
})

export default FetchCurrentUser
