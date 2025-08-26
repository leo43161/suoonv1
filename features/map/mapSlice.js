import { createSlice } from "@reduxjs/toolkit";
import * as Crypto from 'expo-crypto';

const tucumanCenter = {
    latitude: -26.826016,
    longitude: -65.214778,
};

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        origin: {
            latitude: tucumanCenter.latitude + 0.005,
            longitude: tucumanCenter.longitude + 0.005,
        },
        destination: {
            latitude: tucumanCenter.latitude - 0.005,
            longitude: tucumanCenter.longitude - 0.005,
        },
        location: null,
        center: {
            latitude: -26.826016,
            longitude: -65.214778,
        },
        sessionKey: Crypto.randomUUID(),
        zoom: 15,
        busesCoords: [],
    },
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setCenter: (state, action) => {
            state.center = action.payload;
        },
        setLocation: (state, action) => {
            state.location = action.payload;
            if (action.payload && !state.origin && !state.destination) {
                state.center = action.payload;
            }
        },
        swapOriginDestination: (state) => {
            // Solo intercambiamos si ambos existen para evitar errores
            if (state.origin && state.destination) {
                const tempOrigin = state.origin;
                state.origin = state.destination;
                state.destination = tempOrigin;
            }
        },
        setZoom: (state, action) => {
            state.zoom = action.payload;
        },
        setBusesCoords: (state, action) => {
            state.busesCoords = action.payload;
        },
        resetMapState: (state) => {
            state.origin = null;
            state.destination = null;
            state.busesCoords = [];
            state.sessionKey = Crypto.randomUUID();
        }
    }
})

export const { setOrigin, setDestination, setLocation, setZoom, setCenter, setBusesCoords, resetMapState, swapOriginDestination } = mapSlice.actions;
export default mapSlice.reducer;