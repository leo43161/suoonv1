import { createSlice } from "@reduxjs/toolkit";
import buses from '../../data/Buses.json'; // Asegúrate de que esta ruta sea correcta

const convertNodos = (objeto) => {
    // Convierte los nodos en un nuevo objeto con { latitude, longitude }
    if (objeto?.nodos) {
        const nodosConvertidos = objeto.nodos.map(([latitude, longitude]) => ({ latitude, longitude }));
        return { ...objeto, nodos: nodosConvertidos };
    }
    return { ...objeto, nodos: [] };
};

export const busesSlice = createSlice({
    name: 'maps',
    initialState: {
        value: {
            busesMatch: [],      // Lista de buses matcheados (con startIndex y endIndex)
            busesAllMatch: [],   // Todos los buses matcheados, si se necesitan
            busSelected: null,   // El bus seleccionado para ver en detalle
            recorrido: {},       // El recorrido completo del bus seleccionado
            matchedSegment: {    // El segmento del recorrido que coincide con origen/destino
                startIndex: -1,
                endIndex: -1,
            },
        }
    },
    reducers: {
        setBusSelected: (state, action) => {
            // El action.payload ahora es el objeto completo del bus matcheado (incluyendo startIndex/endIndex)
            state.value.busSelected = action.payload;
            state.value.matchedSegment.startIndex = action.payload?.startIndex !== undefined ? action.payload.startIndex : -1;
            state.value.matchedSegment.endIndex = action.payload?.endIndex !== undefined ? action.payload.endIndex : -1;
        },
        setBusesMatch: (state, action) => {
            // action.payload es un array de objetos { cod, linea, descripcion, startIndex, endIndex }
            let colectivosMatchedData = action.payload;

            if (colectivosMatchedData && colectivosMatchedData.length > 0) {
                // Aquí, colectivosMatchedData ya viene con la info de match.
                // Podríamos buscar los datos completos del bus en el JSON local si fuera necesario,
                // pero por ahora, asumimos que los datos esenciales (linea, descripcion) ya vienen.
                // Si necesitas más datos del bus, busca en `buses` aquí:
                const hydratedBuses = colectivosMatchedData.map(matchedBus => {
                    const fullBusData = buses.find(b => b.cod === matchedBus.cod);
                    return {
                        ...fullBusData, // Datos completos del bus
                        ...matchedBus,  // Sobrescribe con los datos del match (startIndex, endIndex)
                    };
                }).filter(Boolean); // Filtra cualquier `undefined` si no se encontró el bus

                state.value.busesAllMatch = hydratedBuses;
                state.value.busesMatch = hydratedBuses.slice(0, 7); // Muestra los primeros 7

                // Seleccionar el primer bus matcheado por defecto y guardar sus índices de segmento.
                if (hydratedBuses.length > 0) {
                    state.value.busSelected = hydratedBuses[0];
                    state.value.matchedSegment.startIndex = hydratedBuses[0].startIndex;
                    state.value.matchedSegment.endIndex = hydratedBuses[0].endIndex;
                } else {
                    state.value.busSelected = null;
                    state.value.matchedSegment.startIndex = -1;
                    state.value.matchedSegment.endIndex = -1;
                }

            } else {
                state.value.busesMatch = [];
                state.value.busesAllMatch = [];
                state.value.busSelected = null;
                state.value.recorrido = {};
                state.value.matchedSegment.startIndex = -1;
                state.value.matchedSegment.endIndex = -1;
            }
        },
        setRecorrido: (state, action) => {
            state.value.recorrido = convertNodos(action.payload);
        },
        resetMapsState: (state) => { // Un reset más completo para el estado de mapas
            state.value.busesMatch = [];
            state.value.busesAllMatch = [];
            state.value.busSelected = null;
            state.value.recorrido = {};
            state.value.matchedSegment.startIndex = -1;
            state.value.matchedSegment.endIndex = -1;
        }
    }
})

export const { setBusSelected, setBusesMatch, setRecorrido, resetMapsState } = busesSlice.actions;
export default busesSlice.reducer;