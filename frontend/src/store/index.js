import { configureStore } from "@reduxjs/toolkit"
import { categoryApiSlice, userApiSlice, authApiSlice } from "./apiSlice"
import categoryFormReducer from './slice/categoryFormSlice'
import registerFormReducer from './slice/registerFormSlice'
import loginFormReducer from './slice/loginFormSlice'
import authReducer from "./slice/authSlice"

const store = configureStore({
    reducer: {
        category: categoryApiSlice.reducer,
        user: userApiSlice.reducer,
        authApi: authApiSlice.reducer,
        categoryForm: categoryFormReducer,
        registerForm: registerFormReducer,
        loginForm: loginFormReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(categoryApiSlice.middleware, userApiSlice.middleware, authApiSlice.middleware)
})

export default store