import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload)); // Store user session
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user"); // Clear session
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
