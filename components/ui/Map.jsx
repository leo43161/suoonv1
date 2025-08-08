import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { colors } from '../../global/colors';

/**
 * Componente que renderiza el mapa y sus elementos.
 * Es un componente 100% controlado que recibe toda la data a visualizar vía props.
 * Su vista es un reflejo directo del estado de Redux.
 * @param {object} props
 * @param {object} props.region - La región a mostrar en el mapa (controlada).
 * @param {object | null} props.origin - Coordenadas del marcador de origen.
 * @param {object | null} props.destination - Coordenadas del marcador de destino.
 * @param {function} props.onOriginDragEnd - Callback al soltar el marcador de origen.
 * @param {function} props.onDestinationDragEnd - Callback al soltar el marcador de destino.
 * @param {array} props.fullRouteCoords - Coordenadas de la ruta completa del colectivo.
 * @param {array} props.matchedSegmentCoords - Coordenadas del tramo que coincide.
 */
const Map = ({
  region,
  origin,
  destination,
  onOriginDragEnd,
  onDestinationDragEnd,
  fullRouteCoords,
  matchedSegmentCoords,
}) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      // La prop 'region' asegura que el mapa siempre refleje el estado de Redux.
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={false} // Usaremos nuestros propios controles de UI
    >
      {/* Renderiza la ruta completa del colectivo (si existe) */}
      {fullRouteCoords && fullRouteCoords.length > 0 && (
        <Polyline
          coordinates={fullRouteCoords}
          strokeColor={colors.secondary || '#888'}
          strokeWidth={4}
        />
      )}

      {/* Renderiza el tramo que coincide (si existe) */}
      {matchedSegmentCoords && matchedSegmentCoords.length > 0 && (
        <Polyline
          coordinates={matchedSegmentCoords}
          strokeColor={colors.primary}
          strokeWidth={7}
        />
      )}

      {/* Marcador de Origen (solo si 'origin' no es null) */}
      {origin && (
        <Marker
          coordinate={origin}
          title="Origen"
          draggable
          onDragEnd={(e) => onOriginDragEnd(e.nativeEvent.coordinate)}
          pinColor={colors.primary}
        />
      )}

      {/* Marcador de Destino (solo si 'destination' no es null) */}
      {destination && (
        <Marker
          coordinate={destination}
          title="Destino"
          draggable
          onDragEnd={(e) => onDestinationDragEnd(e.nativeEvent.coordinate)}
          pinColor={colors.dark}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;