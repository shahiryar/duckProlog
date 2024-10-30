import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppState } from "../../types/slices"

const initialState: IAppState = {
    showSettings: false,
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setShowSettings: (state, action: PayloadAction<boolean>) => {
            state.showSettings = action.payload
        },
    }
})

export const {
    setShowSettings,
} = appSlice.actions
