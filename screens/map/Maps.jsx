import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Acciones de Redux
import { setOrigin, setDestination, setBusesCoords } from '../../features/map/mapSlice';
import { setBusSelected } from '../../features/buses/busesSlice';

// RTK Query Hook
import { useGetRecorridoByCoordsQuery, useReverseGeocodeMutation } from '../../services/api/busesApi';

// Componentes de UI
import Map from '../../components/ui/Map';
import BusesMatchedList from '../../components/ui/BusesMatchedList';
import SearchBottomSheet from '../../components/search/SearchBottomSheet';
import RouteSearchTrigger from '../../components/search/RouteSearchTrigger';
import { setOriginAddress, setOriginSearchAddress } from '../../features/map/searchSlice';


const Maps = ({ route }) => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const [triggerReverseGeocode] = useReverseGeocodeMutation();

  // -1 = cerrado, 0 = primer snapPoint, 1 = segundo snapPoint, etc.
  const [sheetIndex, setSheetIndex] = useState(1);

  const [matchedSegmentCoords, setMatchedSegmentCoords] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  // --- LECTURA DEL ESTADO DE REDUX ---
  const { origin, destination, center, zoom, busesCoords } = useSelector((state) => state.mapReducer);
  const { busSelected } = useSelector((state) => state.busesReducer);

  // --- LÓGICA DE BÚSQUEDA CON RTK QUERY ---
  const {
    data: matchedBuses,
    error,
    isLoading
  } = useGetRecorridoByCoordsQuery(
    { origin, destination },
    { skip: !origin || !destination, refetchOnMountOrArgChange: true }
  );

  // --- NUEVO EFECTO PARA OBTENER LA UBICACIÓN INICIAL ---
  useEffect(() => {
    dispatch(setOriginAddress('Buscando tu ubicación...'));
    dispatch(setOriginSearchAddress('Buscando tu ubicación...'));
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dispatch(setOriginAddress('Permiso de ubicación denegado'));
        dispatch(setOriginSearchAddress('Permiso de ubicación denegado'));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const newOrigin = { latitude, longitude };

      dispatch(setOrigin(newOrigin));

      // 2. Ejecutamos la mutación con las coordenadas obtenidas
      try {
        // .unwrap() permite usar try/catch para manejar el éxito y el error
        const result = await triggerReverseGeocode({ latitude, longitude }).unwrap();
        console.log(result);
        // 3. Si tiene éxito, actualizamos el estado con la dirección
        dispatch(setOriginAddress(result.address));
        dispatch(setOriginSearchAddress(result.address));
      } catch (error) {
        console.error('Falló la geocodificación inversa:', error);
        dispatch(setOriginAddress('No se pudo obtener la dirección'));
        dispatch(setOriginSearchAddress('No se pudo obtener la dirección'));
      }
    };
    getLocation();
  }, [dispatch, triggerReverseGeocode]);

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
  }, [matchedBuses, busSelected, dispatch, origin, destination]);

  useEffect(() => {
    if (busSelected && busSelected.nodos && busSelected.startIndex !== -1) {
      const segment = busSelected.nodos.slice(busSelected.startIndex, busSelected.endIndex + 1);
      setMatchedSegmentCoords(segment);
    } else {
      setMatchedSegmentCoords([]);
    }
  }, [busSelected, origin, destination]);


  // --- NUEVO EFECTO PARA ABRIR EL BOTTOMSHEET AL NAVEGAR ---
  useEffect(() => {
    if (route.params?.openSheetOnLoad) {
      setSheetIndex(2); // Cambia el estado para abrir el BottomSheet
    }
  }, [route.params?.openSheetOnLoad]);

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

  const handleOpenOriginSearch = () => {
    setActiveInput('origin'); // Marcamos que el input de origen es el activo
    setSheetIndex(2); // Abrimos el BottomSheet
  };

  const handleOpenDestinationSearch = () => {
    setActiveInput('destination'); // Marcamos que el input de destino es el activo
    setSheetIndex(2);
  };

  const handleSheetChanges = (index) => {
    setSheetIndex(index);
    // Si el usuario cierra el panel, reseteamos el input activo
    if (index === -1) {
      setActiveInput(null);
    }
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
      <RouteSearchTrigger
        onOriginPress={handleOpenOriginSearch}
        onDestinationPress={handleOpenDestinationSearch}
      />

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
        activeInput={activeInput}
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