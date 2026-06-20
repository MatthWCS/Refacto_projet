import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout, setCredentials } from "@slice/authSlice"

// -------------------------------------------------------
// authApiSlice
// L'access token est attaché en en-tête Authorization (Bearer)
// depuis le store — jamais via cookie. Seul refresh_token
// (httpOnly, posé par le backend) voyage en cookie, d'où
// credentials: "include" conservé ici.
// -------------------------------------------------------

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/auth",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken
        if (token) headers.set("Authorization", `Bearer ${token}`)
        headers.set("Content-Type", "application/json")
        return headers
    }
})

/**
 * Wrapper qui tente un refresh-token si la requête échoue
 * avec un 401, puis rejoue la requête initiale avec le
 * nouvel access token.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery(
            { url: "/refresh-token", method: "GET" },
            api,
            extraOptions
        )

        if (refreshResult?.data?.accessToken) {
            api.dispatch(setCredentials({
                user: refreshResult.data.user,
                accessToken: refreshResult.data.accessToken
            }))
            // Rejoue la requête initiale — prepareHeaders relira
            // le nouveau token depuis le store, déjà à jour.
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        register: build.mutation({
            query: (body) => ({
                url: "/register",
                method: "POST",
                body
            })
        }),
        login: build.mutation({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials({
                        user: data?.user ?? null,
                        accessToken: data?.accessToken ?? null
                    }))
                } catch {
                    // l'erreur est gérée côté composant
                }
            }
        }),
        logout: build.mutation({
            query: () => ({
                url: "/logout",
                method: "GET"
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } finally {
                    dispatch(logout())
                }
            }
        }),
        me: build.query({
            query: () => "/me"
        }),
        refreshToken: build.mutation({
            query: () => ({
                url: "/refresh-token",
                method: "GET"
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials({
                        user: data?.user ?? null,
                        accessToken: data?.accessToken ?? null
                    }))
                } catch {
                    dispatch(logout())
                }
            }
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useMeQuery,
    useRefreshTokenMutation
} = authApiSlice