import { createSlice } from "@reduxjs/toolkit";
import buses from '../../data/Buses.json';

const convertNodos = (objeto) => {
    if (objeto?.nodos) {
        const nodosConvertidos = objeto.nodos.map(([latitude, longitude]) => ({ latitude, longitude }));
        return { ...objeto, nodos: nodosConvertidos };
    }
    return { ...objeto, nodos: [] };
};

export const likesSlice = createSlice({
    name: 'likes',
    initialState: {
        value: {
            likedColectivos: [],
            busSelected: null,
            busesCoords: [],
            recorrido: {},
        }
    },
    reducers: {
        likeColectivo: (state, action) => {
            const busToAdd = buses.find(bus => bus.cod === action.payload);
            if (busToAdd && !state.value.likedColectivos.some(bus => bus.cod === action.payload)) {
                state.value.likedColectivos.push(busToAdd);
            }
        },
        unlikeColectivo: (state, action) => {
            state.value.likedColectivos = state.value.likedColectivos.filter(bus => bus.cod !== action.payload);
        },
        setBusSelected: (state, action) => {
            state.value.busSelected = state.value.likedColectivos.find(bus => bus.cod === parseInt(action.payload));
        },
        setRecorrido: (state, action) => {
            state.value.recorrido = convertNodos(action.payload);
        },
        setBusesCoords: (state, action) => {
            state.value.busesCoords = action.payload;
        },
        resetLikesState: (state) => {
            state.value.busSelected = null;
            state.value.busesCoords = [];
            state.value.recorrido = {};
        }
    }
})

export const { likeColectivo, unlikeColectivo, setBusSelected, setRecorrido, setBusesCoords, resetLikesState } = likesSlice.actions;
export default likesSlice.reducer;