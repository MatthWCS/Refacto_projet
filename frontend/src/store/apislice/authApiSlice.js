import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout, setCredentials } from "@slice/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/auth",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
})

/**
 * Wrapper de baseQuery qui tente un refresh-token si la requête
 * échoue avec un 401, puis rejoue la requête initiale.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery(
            { url: "/refresh-token", method: "GET" },
            api,
            extraOptions
        )

        if (refreshResult?.data) {
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
                    dispatch(setCredentials({ user: data?.user ?? null }))
                } catch {
                    // l'erreur est gérée côté composant (toast)
                }
            }
        }),

        logout: build.mutation({
            query: () => ({
                url: "/logout",
                method: "GET"
            })
        }),

        me: build.query({
            query: () => "/me"
        }),

        refreshToken: build.mutation({
            query: () => ({
                url: "/refresh-token",
                method: "GET"
            })
        }),

        updateAccount: build.mutation({
            query: (body) => ({
                url: "/account",
                method: "PATCH",
                body  // { currentPassword, username?, password? }
            })
        })

    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useMeQuery,
    useRefreshTokenMutation,
    useUpdateAccountMutation,
} = authApiSlice
