import { configureStore } from "@reduxjs/toolkit"
import { authApiSlice, gameApiSlice } from "./apislice"
import authReducer from "./slice/authSlice"

const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [gameApiSlice.reducerPath]: gameApiSlice.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApiSlice.middleware, gameApiSlice.middleware)
})

export default store
