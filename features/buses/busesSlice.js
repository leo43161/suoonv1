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
    name: 'buses',
    initialState: {
        busesMatch: [],      // Lista de buses matcheados (con startIndex y endIndex)
        busesAllMatch: [],   // Todos los buses matcheados, si se necesitan
        busSelected: null,   // El bus seleccionado para ver en detalle
        recorrido: {},       // El recorrido completo del bus seleccionado
        matchedSegment: {    // El segmento del recorrido que coincide con origen/destino
            startIndex: -1,
            endIndex: -1,
        },
        busPositions: [],
    },
    reducers: {
        setBusSelected: (state, action) => {
            // El action.payload ahora es el objeto completo del bus matcheado (incluyendo startIndex/endIndex)
            state.busSelected = action.payload;
            state.matchedSegment.startIndex = action.payload?.startIndex !== undefined ? action.payload.startIndex : -1;
            state.matchedSegment.endIndex = action.payload?.endIndex !== undefined ? action.payload.endIndex : -1;
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

                state.busesAllMatch = hydratedBuses;
                state.busesMatch = hydratedBuses.slice(0, 7); // Muestra los primeros 7

                // Seleccionar el primer bus matcheado por defecto y guardar sus índices de segmento.
                if (hydratedBuses.length > 0) {
                    state.busSelected = hydratedBuses[0];
                    state.matchedSegment.startIndex = hydratedBuses[0].startIndex;
                    state.matchedSegment.endIndex = hydratedBuses[0].endIndex;
                } else {
                    state.busSelected = null;
                    state.matchedSegment.startIndex = -1;
                    state.matchedSegment.endIndex = -1;
                }

            } else {
                state.busesMatch = [];
                state.busesAllMatch = [];
                state.busSelected = null;
                state.recorrido = {};
                state.matchedSegment.startIndex = -1;
                state.matchedSegment.endIndex = -1;
            }
        },
        setRecorrido: (state, action) => {
            state.recorrido = convertNodos(action.payload);
        },
        resetMapsState: (state) => { // Un reset más completo para el estado de mapas
            state.busesMatch = [];
            state.busesAllMatch = [];
            state.busSelected = null;
            state.recorrido = {};
            state.matchedSegment.startIndex = -1;
            state.matchedSegment.endIndex = -1;
            state.busPositions = [];
        },
        setBusPositions: (state, action) => {
            state.busPositions = action.payload;
        },
    }
})

export const { setBusSelected, setBusesMatch, setRecorrido, resetMapsState, setBusPositions } = busesSlice.actions;
export default busesSlice.reducer;