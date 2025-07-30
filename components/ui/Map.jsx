import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import {colors} from '../../global/colors';

/**
 * Componente que renderiza el mapa y los elementos sobre él.
 * Es un componente controlado que recibe toda la data a visualizar vía props.
 * @param {object} props
 * @param {object} props.initialRegion - La región inicial a mostrar en el mapa.
 * @param {object} props.origin - Coordenadas del marcador de origen.
 * @param {object} props.destination - Coordenadas del marcador de destino.
 * @param {function} props.onOriginDragEnd - Callback al soltar el marcador de origen.
 * @param {function} props.onDestinationDragEnd - Callback al soltar el marcador de destino.
 * @param {array} props.fullRouteCoords - Coordenadas de la ruta completa del colectivo.
 * @param {array} props.matchedSegmentCoords - Coordenadas del tramo que coincide.
 * @returns {React.Component}
 */
const Map = ({
  initialRegion,
  origin,
  destination,
  onOriginDragEnd,
  onDestinationDragEnd,
  fullRouteCoords,
  matchedSegmentCoords,
}) => {
  console.log('Renderizando el componente Map con MapView...');

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={false} // Usaremos nuestros propios botones
    >
      {/* 1. Renderiza la ruta completa del colectivo (tenue) */}
      {fullRouteCoords && fullRouteCoords.length > 0 && (
        <Polyline
          coordinates={fullRouteCoords}
          strokeColor={colors.secondary || '#888'} // Color secundario o gris
          strokeWidth={4}
        />
      )}

      {/* 2. Renderiza el tramo que coincide (resaltado) */}
      {matchedSegmentCoords && matchedSegmentCoords.length > 0 && (
        <Polyline
          coordinates={matchedSegmentCoords}
          strokeColor={colors.primary} // Color primario, bien visible
          strokeWidth={7} // Más grueso para destacar
        />
      )}

      {/* 3. Marcador de Origen (arrastrable) */}
      {origin && (
        <Marker
          coordinate={origin}
          title="Origen"
          draggable
          onDragEnd={(e) => onOriginDragEnd(e.nativeEvent.coordinate)}
          pinColor={colors.primary}
        />
      )}

      {/* 4. Marcador de Destino (arrastrable) */}
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
    ...StyleSheet.absoluteFillObject, // Hace que el mapa ocupe todo el contenedor
  },
});

export default Map;