import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout } from "@store/slice/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:9000/auth',
    headers: { "Content-Type": "application/json" },
    credentials: 'include'
})

const baseQueryWithAuth = (params, apiUrl, options) => {
    let result = baseQuery(params, apiUrl, options)

    if (result?.error?.status === 401) {
        // si token expire, on refresh
        const refreshResult = baseQuery({
            url: '/refresh-token',
            method: 'GET'
        },
            apiUrl,
            options
        )
        if (refreshResult?.data) {
            // refresh ok
            result = baseQuery(params, apiUrl, options)
        } else {
            // refresh echoue, on delog
            apiUrl.dispatch(logout())
        }
    }
    return result
}

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithAuth,
    endpoints: build => ({
        signIn: build.mutation({
            query: (body) => ({
                url: "/login",
                method: 'POST',
                body
            })
        }),
        signOut: build.mutation({
            query: () => ({
                url: "/logout",
                method: 'GET'
            })
        }),
        refreshToken: build.mutation({
            query: () => ({
                url: '/refresh-token',
                method: 'GET'
            })
        }),
        authProfil: build.query({
            method: 'GET',
            query: () => '/me'
        })
    })
})

export const { useSignInMutation, useSignOutMutation, useRefreshTokenMutation, useAuthProfilQuery } = authApiSlice