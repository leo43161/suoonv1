import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { colors } from '../../global/colors';

// Envolvemos el componente con forwardRef
const Map = forwardRef(({ region, origin, ...props }, ref) => {
  return (
    <MapView
      ref={ref} // La ref se asigna aquí
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={false}
    >
      {/* ...el resto del JSX de los polylines y markers se mantiene igual... */}
      {props.fullRouteCoords && props.fullRouteCoords.length > 0 && (
        <Polyline
          coordinates={props.fullRouteCoords}
          strokeColor={colors.secondary || '#888'}
          strokeWidth={4}
        />
      )}
      {props.matchedSegmentCoords && props.matchedSegmentCoords.length > 0 && (
        <Polyline
          coordinates={props.matchedSegmentCoords}
          strokeColor={colors.primary}
          strokeWidth={7}
        />
      )}
      {origin && (
        <Marker
          coordinate={origin}
          title="Origen"
          draggable
          onDragEnd={(e) => props.onOriginDragEnd(e.nativeEvent.coordinate)}
          pinColor={colors.primary}
        />
      )}
      {props.destination && (
        <Marker
          coordinate={props.destination}
          title="Destino"
          draggable
          onDragEnd={(e) => props.onDestinationDragEnd(e.nativeEvent.coordinate)}
          pinColor={colors.dark}
        />
      )}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;