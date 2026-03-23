import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    email: "",
    password: ""
}

export const loginFormSlice = createSlice({
    name: "loginForm",
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        },
    }
})

export const { setEmail, setPassword } = loginFormSlice.actions
export default loginFormSlice.reducer