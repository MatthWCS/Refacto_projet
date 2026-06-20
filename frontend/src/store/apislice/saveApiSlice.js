import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// -------------------------------------------------------
// saveApiSlice
// Endpoints de gestion des sauvegardes et du compte.
//
// Sauvegardes : /api/save
//   GET    /api/save          — liste (max 3 slots)
//   POST   /api/save          — sauvegarde la session en cours
//   GET    /api/save/load     — charge un slot (?slot=xxx)
//   DELETE /api/save/:slot    — supprime un slot
//
// Compte : /api/auth/account
//   PATCH  /api/auth/account  — modifie username et/ou password
// -------------------------------------------------------

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken
        if (token) headers.set("Authorization", `Bearer ${token}`)
        headers.set("Content-Type", "application/json")
        return headers
    }
})

export const saveApiSlice = createApi({
    reducerPath: "saveApi",
    baseQuery,
    tagTypes: ["Saves"],
    endpoints: (build) => ({

        // ---- Sauvegardes ----

        listSaves: build.query({
            query: () => "/save",
            providesTags: ["Saves"]
        }),

        saveGame: build.mutation({
            query: (body) => ({
                url: "/save",
                method: "POST",
                body  // { slot }
            }),
            invalidatesTags: ["Saves"]
        }),

        loadSave: build.query({
            query: (slot) => `/save/load?slot=${slot}`
        }),

        deleteSave: build.mutation({
            query: (slot) => ({
                url: `/save/${slot}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Saves"]
        }),

        // ---- Compte ----

        updateAccount: build.mutation({
            query: (body) => ({
                url: "/auth/account",
                method: "PATCH",
                body  // { currentPassword, username?, password? }
            })
        })
    })
})

export const {
    useListSavesQuery,
    useSaveGameMutation,
    useLoadSaveQuery,
    useDeleteSaveMutation,
    useUpdateAccountMutation
} = saveApiSlice