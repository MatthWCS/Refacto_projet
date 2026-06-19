import { configureStore } from "@reduxjs/toolkit"
import { adminApiSlice, authApiSlice, gameApiSlice, saveApiSlice } from "./apislice"
import authReducer from "./slice/authSlice"

const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [gameApiSlice.reducerPath]: gameApiSlice.reducer,
        [saveApiSlice.reducerPath]: saveApiSlice.reducer,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApiSlice.middleware,
            gameApiSlice.middleware,
            saveApiSlice.middleware,
            adminApiSlice.middleware,
        )
})

export default store
