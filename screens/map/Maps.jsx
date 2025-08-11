import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { setOrigin, setDestination, setBusesCoords } from '../../features/map/mapSlice';
import { useGetRecorridoByCoordsQuery } from '../../services/api/busesApi';

import Map from '../../components/ui/Map';
import BusesMatchedList from '../../components/ui/BusesMatchedList';
import { setBusSelected } from '../../features/buses/busesSlice';

import SearchBottomSheet from '../../components/search/SearchBottomSheet';


const Maps = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const {
    origin,
    destination,
    center,
    zoom,
    busesCoords
  } = useSelector((state) => state.mapReducer);

  const { busSelected } = useSelector((state) => state.busesReducer);

  const [matchedSegmentCoords, setMatchedSegmentCoords] = useState([]);

  const {
    data: matchedBuses, // 'data' se renombra a 'matchedBuses' para mayor claridad
    error,
    isLoading // ¡Obtenemos estados de carga y error gratis!
  } = useGetRecorridoByCoordsQuery(
    { origin, destination },
    { skip: !origin || !destination } // No ejecuta la consulta si falta origen o destino
  );

  // --- EFECTO PARA AJUSTAR EL MAPA AL TRAMO ---
  useEffect(() => {
    // Si tenemos un segmento para mostrar y la ref del mapa está lista...
    if (matchedSegmentCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(matchedSegmentCoords, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 150, // Más padding abajo para no ser tapado por la lista de buses
          left: 50,
        },
        animated: true,
      });
    }
  }, [matchedSegmentCoords]);

  // --- EFECTO PARA SELECCIONAR EL PRIMER BUS POR DEFECTO ---
  useEffect(() => {
    // Si la búsqueda termina y hay resultados, pero no hay ningún bus seleccionado aún...
    if (matchedBuses && matchedBuses.length > 0 && !busSelected) {
      // ...seleccionamos el primer bus de la lista.
      handleSelectBus(matchedBuses[0]);
    }
    // Si no hay resultados, limpiamos las rutas del mapa
    else if (matchedBuses && matchedBuses.length === 0) {
      dispatch(setBusesCoords([]));
      dispatch(setBusSelected(null));
    }
  }, [matchedBuses, busSelected, dispatch]);

  // --- EFECTO PARA CALCULAR EL SEGMENTO DEL RECORRIDO ---
  useEffect(() => {
    if (busSelected && busSelected.nodos && busSelected.startIndex !== -1) {
      const segment = busSelected.nodos.slice(
        busSelected.startIndex,
        busSelected.endIndex + 1
      );
      setMatchedSegmentCoords(segment);
    } else {
      setMatchedSegmentCoords([]); // Limpiar si no hay bus seleccionado
    }
  }, [busSelected]);

  // --- MANEJADORES DE EVENTOS ---
  const handleOriginDragEnd = (coords) => {
    dispatch(setOrigin(coords));
    dispatch(setBusSelected(null));
  };

  const handleDestinationDragEnd = (coords) => {
    dispatch(setDestination(coords));
    dispatch(setBusSelected(null));
  };


  const handleSelectBus = (bus) => {
    // 1. Informa al 'busesSlice' cuál es el bus seleccionado
    dispatch(setBusSelected(bus));
    // 2. Informa al 'mapSlice' cuáles son las coordenadas de la ruta COMPLETA a dibujar
    dispatch(setBusesCoords(bus.nodos));
  };

  // Calcula la región del mapa dinámicamente
  const region = {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.0922 / (2 ** (zoom - 12)), // Ajuste de delta por zoom
    longitudeDelta: 0.0421 / (2 ** (zoom - 12)),
  };

  useEffect(() => {
    // Verificamos si el parámetro 'openSheetOnLoad' fue enviado y es true
    if (route.params?.openSheetOnLoad) {
      // Si es así, usamos la ref para llamar al método 'expand' del BottomSheet
      bottomSheetRef.current?.expand();
    }
  }, [route.params?.openSheetOnLoad]); // El efecto depende de este parámetro

  const handleOpenSearch = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
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
      </View>

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
      <SearchBottomSheet ref={bottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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