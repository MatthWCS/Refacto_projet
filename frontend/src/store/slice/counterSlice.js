import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    counter: 0
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.counter += 1
        },
        decrement: (state) => {
            state.counter -= 1
        },
        incrementByValue: (state, action) => {
            state.counter += action.payload.value
        },
        reset: (state) => {
            state.counter = 0
        }
    }
})

export const { increment, decrement, incrementByValue, reset } = counterSlice.actions
export default counterSlice.reducer


// pour ajouter 5 au counter
/*
dispatchEvent(
    incrementByValue({ value: 5 })
)
*/