import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token: null,
    refresh_token: null,
    user: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token
            state.refresh_token = action.payload.refresh_token
            state.user = action.payload.user
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.token = null
            state.refresh_token = null
            state.user = null
            state.isAuthenticated = false
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer