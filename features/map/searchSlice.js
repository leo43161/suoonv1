import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        originAddress: "",
        destinationAddress: "",
        originSearchAddress: "",
        destinationSearchAddress: "",
        indexBottomSheet: -1
    },
    reducers: {
        setOriginAddress: (state, action) => {
            state.originAddress = action.payload;
        },

        setDestinationAddress: (state, action) => {
            state.destinationAddress = action.payload;
        },
        setOriginSearchAddress: (state, action) => {
            state.originSearchAddress = action.payload;
        },

        setDestinationSearchAddress: (state, action) => {
            state.destinationSearchAddress = action.payload;
        },

        setBottomSheetIndex: (state, action) => {
            state.indexBottomSheet = action.payload;
        },
    }
})

export const { setOriginAddress, setDestinationAddress, setOriginSearchAddress, setDestinationSearchAddress, setBottomSheetIndex } = searchSlice.actions;
export default searchSlice.reducer;