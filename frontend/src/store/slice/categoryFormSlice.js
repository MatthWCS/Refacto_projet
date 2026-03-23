import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: ""
}

export const categoryFormSlice = createSlice({
    name: "categoryForm",
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.name = action.payload.name
        }
    }
})

export const { setCategory } = categoryFormSlice.actions
export default categoryFormSlice.reducer