import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Acciones de Redux
import { setOrigin, setDestination, setBusesCoords } from '../../features/map/mapSlice';
import { setBusSelected } from '../../features/buses/busesSlice';

// RTK Query Hook
import { useGetRecorridoByCoordsQuery } from '../../services/api/busesApi';

// Componentes de UI
import Map from '../../components/ui/Map';
import BusesMatchedList from '../../components/ui/BusesMatchedList';
import SearchBottomSheet from '../../components/search/SearchBottomSheet';


const Maps = ({ route }) => {
  console.log('Parámetros de ruta recibidos en Maps.jsx:', route.params);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);

  // --- NUEVO ESTADO PARA CONTROLAR EL BOTTOMSHEET ---
  // -1 = cerrado, 0 = primer snapPoint, 1 = segundo snapPoint, etc.
  const [sheetIndex, setSheetIndex] = useState(0);

  // --- LECTURA DEL ESTADO DE REDUX ---
  const { origin, destination, center, zoom, busesCoords } = useSelector((state) => state.mapReducer);
  const { busSelected } = useSelector((state) => state.busesReducer);
  const [matchedSegmentCoords, setMatchedSegmentCoords] = useState([]);

  // --- LÓGICA DE BÚSQUEDA CON RTK QUERY ---
  const {
    data: matchedBuses,
    error,
    isLoading
  } = useGetRecorridoByCoordsQuery(
    { origin, destination },
    { skip: !origin || !destination }
  );

  // --- EFECTOS SECUNDARIOS (SIN CAMBIOS) ---
  useEffect(() => {
    if (matchedSegmentCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(matchedSegmentCoords, {
        edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
        animated: true,
      });
    }
  }, [matchedSegmentCoords]);

  useEffect(() => {
    if (matchedBuses && matchedBuses.length > 0 && !busSelected) {
      handleSelectBus(matchedBuses[0]);
    } else if (matchedBuses && matchedBuses.length === 0) {
      dispatch(setBusesCoords([]));
      dispatch(setBusSelected(null));
    }
  }, [matchedBuses, busSelected, dispatch]);

  useEffect(() => {
    if (busSelected && busSelected.nodos && busSelected.startIndex !== -1) {
      const segment = busSelected.nodos.slice(busSelected.startIndex, busSelected.endIndex + 1);
      setMatchedSegmentCoords(segment);
    } else {
      setMatchedSegmentCoords([]);
    }
  }, [busSelected]);


  // --- NUEVO EFECTO PARA ABRIR EL BOTTOMSHEET AL NAVEGAR ---
  useEffect(() => {
    if (route.params?.openSheetOnLoad) {
      setSheetIndex(0); // Cambia el estado para abrir el BottomSheet
    }
  }, [route.params?.openSheetOnLoad]);


  // --- MANEJADORES DE EVENTOS ---
  const handleOpenSearch = () => {
    setSheetIndex(0); // Abre el BottomSheet
  };

  const handleSheetChanges = (index) => {
    setSheetIndex(index); // Sincroniza el estado si el usuario cierra el panel
  };

  const handleOriginDragEnd = (coords) => {
    dispatch(setOrigin(coords));
    dispatch(setBusSelected(null));
  };

  const handleDestinationDragEnd = (coords) => {
    dispatch(setDestination(coords));
    dispatch(setBusSelected(null));
  };

  const handleSelectBus = (bus) => {
    dispatch(setBusSelected(bus));
    dispatch(setBusesCoords(bus.nodos));
  };

  const region = {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.0922 / (2 ** (zoom - 12)),
    longitudeDelta: 0.0421 / (2 ** (zoom - 12)),
  };

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        region={region}
        origin={origin}
        destination={destination}
        fullRouteCoords={busesCoords}
        matchedSegmentCoords={matchedSegmentCoords}
        onOriginDragEnd={handleOriginDragEnd}
        onDestinationDragEnd={handleDestinationDragEnd}
      />

      {/* Disparador de Búsqueda en la parte superior */}
      <TouchableOpacity style={styles.searchTrigger} onPress={handleOpenSearch}>
        <Text style={styles.searchTriggerText}>¿Hacia donde vas?</Text>
      </TouchableOpacity>

      {/* La lista de resultados sigue en su lugar */}
      <View style={styles.busesListContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>Error al buscar rutas.</Text>
        ) : (
          <BusesMatchedList
            matchedBuses={matchedBuses || []}
            onSelectBus={handleSelectBus}
            selectedBusCod={busSelected?.cod}
          />
        )}
      </View>

      {/* BottomSheet controlado por estado */}
      <SearchBottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        onChange={handleSheetChanges}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchTrigger: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchTriggerText: {
    fontSize: 16,
    color: '#555',
  },
  busesListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  errorText: { // Estilo que faltaba
    textAlign: 'center',
    color: 'red',
  }
});

export default Maps;