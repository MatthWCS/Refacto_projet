import { configureStore } from "@reduxjs/toolkit"
import { authApiSlice, gameApiSlice, saveApiSlice } from "./apislice"
import authReducer from "./slice/authSlice"

const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [gameApiSlice.reducerPath]: gameApiSlice.reducer,
        [saveApiSlice.reducerPath]: saveApiSlice.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApiSlice.middleware,
            gameApiSlice.middleware,
            saveApiSlice.middleware,
        )
})

export default store
