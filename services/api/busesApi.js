import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TUCUBUS_API_URL } from '../../constants/config'; // Aunque no se usará directamente para las rutas, se mantiene la configuración base.
import allBusesData from '../../data/Buses.json'; // Importa tus datos de Buses.json directamente

// Función para calcular distancia (la misma que ya tenías)
const getDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344; }
        if (unit === "N") { dist = dist * 0.8684; }
        return dist;
    }
}

export const busesApi = createApi({
    reducerPath: "busesApi",
    // BaseQuery puede ser un dummy o simplemente mantenerse si otras partes de la API real se usarán.
    // Para estas dos consultas, usaremos `queryFn` para sobrescribir el comportamiento.
    baseQuery: fetchBaseQuery({ baseUrl: TUCUBUS_API_URL }),
    endpoints: (builder) => ({
        getRecorridoByCoords: builder.query({
            // Usamos queryFn para devolver los datos locales directamente
            queryFn: ({ origin, destination }) => {
                let matchedBuses = [];
                const allRecorridos = allBusesData; // Usamos los datos importados

                for (const recorrido of allRecorridos) {
                    if (!Array.isArray(recorrido.nodos) || recorrido.nodos.length < 2) {
                        continue;
                    }

                    let startIndex = -1;
                    let endIndex = -1;
                    const PROXIMITY_THRESHOLD_KM = 0.5; // Umbral de 0.5 km para considerar una "parada" cercana

                    // Encontrar el nodo más cercano al origen
                    for (let i = 0; i < recorrido.nodos.length; i++) {
                        const node = recorrido.nodos[i];
                        if (!Array.isArray(node) || node.length !== 2 || typeof node[0] !== 'number' || typeof node[1] !== 'number') {
                            console.warn("Coordenada inválida en recorrido para cod:", recorrido.cod, node);
                            continue;
                        }
                        const distToOrigin = getDistance(node[0], node[1], origin.latitude, origin.longitude, "K");
                        if (distToOrigin < PROXIMITY_THRESHOLD_KM) {
                            startIndex = i;
                            break;
                        }
                    }

                    // Si se encontró un posible punto de origen, buscar el destino
                    if (startIndex !== -1) {
                        for (let i = startIndex; i < recorrido.nodos.length; i++) {
                            const node = recorrido.nodos[i];
                            const distToDestination = getDistance(node[0], node[1], destination.latitude, destination.longitude, "K");
                            if (distToDestination < PROXIMITY_THRESHOLD_KM) {
                                endIndex = i;
                                break;
                            }
                        }
                    }

                    // Si se encontraron ambos y el destino está después del origen en el recorrido
                    if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
                        matchedBuses.push({
                            cod: recorrido.cod,
                            linea: recorrido.linea, // Asegúrate de que estas propiedades existan en tu Buses.json
                            descripcion: recorrido.descripcion, // Asegúrate de que estas propiedades existan en tu Buses.json
                            startIndex: startIndex,
                            endIndex: endIndex
                        });
                    }
                }
                // Ordenar los buses matcheados (por ejemplo, por la menor distancia del origen al punto de inicio del colectivo)
                // Aquí podrías refinar el criterio de ordenamiento si lo necesitas, como la distancia al origen del primer nodo encontrado.
                // Por ahora, simplemente devolveremos los primeros 15 que cumplan.
                matchedBuses = matchedBuses.slice(0, 15);
                return { data: matchedBuses }; // RTK Query espera un objeto { data: ... } o { error: ... }
            }
        }),
        getRecorridoByCod: builder.query({
            // Usamos queryFn para devolver los datos locales directamente
            queryFn: (cod) => {
                const foundBus = allBusesData.find(bus => bus.cod === parseInt(cod));
                if (foundBus) {
                    return { data: foundBus };
                }
                return { error: { status: 404, data: 'Recorrido no encontrado' } };
            }
        }),
    })
});

export const { useGetRecorridoByCoordsQuery, useGetRecorridoByCodQuery } = busesApi;