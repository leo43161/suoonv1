import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Importamos los componentes de UI que creamos y actualizamos
import Map from '../../components/ui/Map';
import BusesMatchedList from '../../components/ui/BusesMatchedList';
// import { setOrigin, setDestination, setSelectedBus } from '../../features/map/mapSlice' // Futuro

/**
 * Pantalla principal del mapa.
 * Contiene el mapa, la lista de colectivos que coinciden y los controles de UI.
 */
const Maps = () => {
  // const dispatch = useDispatch(); // Lo usaremos pronto

  // --- SIMULACIÓN DE DATOS (reemplazaremos esto con Selectors de Redux) ---
  const initialRegion = {
    latitude: -26.832222,
    longitude: -65.221944,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const origin = { latitude: -26.836, longitude: -65.222 };
  const destination = { latitude: -26.825, longitude: -65.22 };

  // Datos simulados de un recorrido completo y el tramo encontrado
  const fullBusRoute = [
    { latitude: -26.84, longitude: -65.23 },
    { latitude: -26.836, longitude: -65.222 }, // Cerca del origen
    { latitude: -26.83, longitude: -65.215 },
    { latitude: -26.825, longitude: -65.22 }, // Cerca del destino
    { latitude: -26.82, longitude: -65.225 },
  ];

  const matchedSegment = fullBusRoute.slice(1, 4); // El tramo entre los puntos cercanos

  // Datos simulados para la lista de colectivos encontrados
  const matchedBuses = [
    { cod: '10_A', linea: '10', descripcion: 'El Colmenar' },
    { cod: '19_B', linea: '19', descripcion: 'B° Policial' },
    { cod: '102_C', linea: '102', descripcion: 'Diagonal' },
  ];
  // --- FIN DE LA SIMULACIÓN ---


  // --- Lógica para manejar eventos (futuramente despacharán acciones de Redux) ---
  const handleOriginDragEnd = (coords) => {
    console.log('Nuevo origen seleccionado:', coords);
    // dispatch(setOrigin(coords));
  };

  const handleDestinationDragEnd = (coords) => {
    console.log('Nuevo destino seleccionado:', coords);
    // dispatch(setDestination(coords));
  };

  const handleSelectBus = (bus) => {
    console.log('Colectivo seleccionado:', bus);
    // dispatch(setSelectedBus(bus));
  }


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          initialRegion={initialRegion}
          origin={origin}
          destination={destination}
          onOriginDragEnd={handleOriginDragEnd}
          onDestinationDragEnd={handleDestinationDragEnd}
          fullRouteCoords={fullBusRoute}
          matchedSegmentCoords={matchedSegment}
        />
      </View>

      <View style={styles.busesListContainer}>
        <BusesMatchedList
            matchedBuses={matchedBuses}
            onSelectBus={handleSelectBus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  busesListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});

export default Maps;