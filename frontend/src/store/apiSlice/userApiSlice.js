import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApiSlice = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9000/user',
        headers: {
            "Content-Type": "application/json"
        }
    }),
    endpoints: build => ({
        addUser: build.mutation({
            query: (newUser) => ({
                url: "",
                method: 'POST',
                body: newUser
            }),
        })
    })
})

export const { useAddUserMutation } = userApiSlice