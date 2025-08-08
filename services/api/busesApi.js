import { TUCUBUS_API_URL } from '../../constants/config'; // Aunque no se usará directamente para las rutas, se mantiene la configuración base.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import busesData from '../../data/Buses.json';

// --- Helper Functions (Lógica extraída y adaptada de index.js) ---

/**
 * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine.
 * @param {object} p1 - Punto 1 con { latitude, longitude }.
 * @param {object} p2 - Punto 2 con { latitude, longitude }.
 * @returns {number} - Distancia en kilómetros.
 */
const getDistanceInKm = (p1, p2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (p2.latitude - p1.latitude) * (Math.PI / 180);
    const dLon = (p2.longitude - p1.longitude) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.latitude * (Math.PI / 180)) * Math.cos(p2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


export const busesApi = createApi({
    reducerPath: "busesApi",
    baseQuery: fetchBaseQuery({ baseUrl: "" }), // No necesitamos una URL base para lógica local
    endpoints: (builder) => ({
        getRecorridoByCoords: builder.query({
            /**
             * QueryFn que ejecuta la lógica de búsqueda de colectivos localmente.
             * No realiza una llamada de red.
             */
            queryFn: ({ origin, destination, radio = 0.8 }) => {
                if (!origin || !destination) {
                    return { data: [] }; // Si no hay origen/destino, no hay resultados.
                }

                const matchedBuses = [];

                // 1. Iterar sobre todas las líneas de colectivo
                for (const bus of busesData) {
                    const paradasOrigenCercanas = [];
                    const paradasDestinoCercanas = [];

                    // 2. Encontrar todos los nodos cercanos al origen y al destino
                    bus.nodos.forEach((nodo, index) => {
                        const punto = { latitude: nodo[0], longitude: nodo[1] };
                        if (getDistanceInKm(origin, punto) <= radio) {
                            paradasOrigenCercanas.push({ index, punto });
                        }
                        if (getDistanceInKm(destination, punto) <= radio) {
                            paradasDestinoCercanas.push({ index, punto });
                        }
                    });

                    // 3. Si hay paradas cercanas en AMBOS puntos, es un match potencial
                    if (paradasOrigenCercanas.length > 0 && paradasDestinoCercanas.length > 0) {
                        let mejorTramo = {
                            startIndex: -1,
                            endIndex: -1,
                            distanciaMinima: 10000000000,
                        };

                        // 4. Encontrar el tramo más corto entre las paradas cercanas
                        for (const paradaOrigen of paradasOrigenCercanas) {
                            for (const paradaDestino of paradasDestinoCercanas) {
                                // Asegurarse de que la subida es antes que la bajada
                                if (paradaOrigen.index < paradaDestino.index) {
                                    const distanciaTramo = paradaDestino.index - paradaOrigen.index;
                                    if (distanciaTramo < mejorTramo.distanciaMinima) {
                                        mejorTramo = {
                                            startIndex: paradaOrigen.index,
                                            endIndex: paradaDestino.index,
                                            distanciaMinima: distanciaTramo,
                                        };
                                    }
                                }
                            }
                        }

                        // 5. Si se encontró un tramo válido, añadir el colectivo a la lista de matches
                        if (mejorTramo.startIndex !== -1) {
                            matchedBuses.push({
                                cod: bus.cod,
                                linea: bus.linea,
                                descripcion: bus.descripcion,
                                ramal: bus.ramal,
                                nodos: bus.nodos.map(n => ({ latitude: n[0], longitude: n[1] })),
                                startIndex: mejorTramo.startIndex,
                                endIndex: mejorTramo.endIndex,
                            });
                        }
                    }
                }
                
                // 6. Devolver los colectivos encontrados. RTK Query lo cacheará.
                return { data: matchedBuses };
            }
        }),
    }),
});

export const { useGetRecorridoByCoordsQuery } = busesApi;