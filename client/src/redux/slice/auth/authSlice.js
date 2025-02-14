import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null, // Store the logged-in user's username
    email: null, // Store the logged-in user's email
    userType: null, // Store the logged-in user's type
    token: null, // Store the authentication token
    isLoggedIn: false, // Track login status
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload.username; // Set username
            state.email = action.payload.email; // Set email
            state.userType = action.payload.userType; // Set user type
            state.token = action.payload.token; // Set token
            state.isLoggedIn = true; // Set login status to true
        },
        logout: (state) => {
            state.username = null;
            state.email = null;
            state.userType = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;