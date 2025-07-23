import { createSlice } from "@reduxjs/toolkit";
import * as Crypto from 'expo-crypto';

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        value: {
            origin: null,
            destination: null,
            location: null,
            center: {
                latitude: -26.826016,
                longitude: -65.214778,
            },
            sessionKey: Crypto.randomUUID(),
            zoom: 15,
            busesCoords: [],
        }
    },
    reducers: {
        setOrigin: (state, action) => {
            state.value.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.value.destination = action.payload;
        },
        setCenter: (state, action) => {
            state.value.center = action.payload;
        },
        setLocation: (state, action) => {
            state.value.location = action.payload;
            if (action.payload && !state.value.origin && !state.value.destination) {
                state.value.center = action.payload;
            }
        },
        setZoom: (state, action) => {
            state.value.zoom = action.payload;
        },
        setBusesCoords: (state, action) => {
            state.value.busesCoords = action.payload;
        },
        resetMapState: (state) => {
            state.value.origin = null;
            state.value.destination = null;
            state.value.busesCoords = [];
            state.value.sessionKey = Crypto.randomUUID();
        }
    }
})

export const { setOrigin, setDestination, setLocation, setZoom, setCenter, setBusesCoords, resetMapState } = mapSlice.actions;
export default mapSlice.reducer;