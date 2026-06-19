import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// -------------------------------------------------------
// adminApiSlice
// Endpoints de gestion des comptes — admin uniquement.
// Préfixe : /api/user (protégé par isAdmin côté backend)
// -------------------------------------------------------

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/user",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
})

export const adminApiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery,
    tagTypes: ["Users"],
    endpoints: (build) => ({

        listUsers: build.query({
            query: () => "/",
            providesTags: ["Users"]
        }),

        getUser: build.query({
            query: (id) => `/${id}`,
            providesTags: (_r, _e, id) => [{ type: "Users", id }]
        }),

        createUser: build.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body  // { username, email, password }
            }),
            invalidatesTags: ["Users"]
        }),

        updateUser: build.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PATCH",
                body  // { username }
            }),
            invalidatesTags: ["Users"]
        }),

        deleteUser: build.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Users"]
        })
    })
})

export const {
    useListUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = adminApiSlice