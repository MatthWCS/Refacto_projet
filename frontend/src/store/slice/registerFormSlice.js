import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: "",
    email: "",
    password: ""
}

export const registerFormSlice = createSlice({
    name: 'registerForm',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        }
    }
})

export const { setName, setEmail, setPassword } = registerFormSlice.actions
export default registerFormSlice.reducer