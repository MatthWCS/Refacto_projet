import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApiSlice = createApi({
    // definit le nom de l'apislice
    reducerPath: "category",
    // definit les options de base des requetes/fetch
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9000/category',
        headers: {
            "Content-Type": "application/json"
        }
    }),
    tagTypes: ['categories'],
    // definit les points d'entree de l'api
    endpoints: build => ({
        // un point d'entree en GET sur http://localhost:9000/category
        getAllCategories: build.query({
            method: "GET",
            query: () => "",
            providesTags: ["categories"],
            transformResponse: (response) => response.categories
        }),
        // un point d'entree en GET sur http://localhost:9000/category/:id
        getCategory: build.query({
            method: 'GET',
            query: (id) => "/" + id,
            transformResponse: (response) => response.category
        }),
        addCategory: build.mutation({
            query: (newCategory) => ({
                url: "",
                method: "POST",
                body: newCategory
            }),
            invalidatesTags: ["categories"]
        }),
        updateCategory: build.query({
            method: "PATCH",
            query: () => ""
        }),
        // un point d'entree en DELETE sur http://localhost:9000/category/:id
        deleteCategory: build.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["categories"]
        })
    })
})

// on export les hook genere automatiquement
export const { useGetAllCategoriesQuery, useGetCategoryQuery, useAddCategoryMutation, useDeleteCategoryMutation } = categoryApiSlice