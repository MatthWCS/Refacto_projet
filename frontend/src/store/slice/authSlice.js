import { createSlice } from "@reduxjs/toolkit"

// -------------------------------------------------------
// authSlice
// accessToken vit UNIQUEMENT en mémoire (jamais persisté,
// jamais en cookie) — perdu à chaque rechargement de page,
// ce qui force un échange via /refresh-token au démarrage
// (cf. useAuthInit). C'est volontaire : réduit la surface
// d'attaque CSRF par rapport à un cookie automatique.
// -------------------------------------------------------

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer