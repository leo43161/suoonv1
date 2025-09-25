import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { colors } from '../../global/colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Envolvemos el componente con forwardRef
const Map = forwardRef(({ region, origin, busPositions = [], ...props }, ref) => {
  return (
    <MapView
      ref={ref} // La ref se asigna aquí
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      showsUserLocation={false}
      showsMyLocationButton={false}
      rotateEnabled={false}
    >
      {/* ...el resto del JSX de los polylines y markers se mantiene igual... */}
      {props.fullRouteCoords && props.fullRouteCoords.length > 0 && (
        <Polyline
          coordinates={props.fullRouteCoords}
          strokeColor={colors.secondary || '#888'}
          strokeWidth={4}
        />
      )}
      {/* Marcadores de colectivos en tiempo real */}
      {busPositions && busPositions.map((position, index) => (
        <Marker
          key={`bus-${position.deviceId}-${index}`}
          coordinate={{
            latitude: position.latitude,
            longitude: position.longitude
          }}
          title={`Bus ${position.numeroInterno}`}
          description={`Patente: ${position.patente}`}
          pinColor={colors.accent}
        >
          <View style={{
            alignItems: 'center',
            padding: 3,
            borderColor:
              colors.dark,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: colors.light,
          }}>
            <FontAwesome5 name={'bus'} size={17} color={colors.dark} />
          </View>
        </Marker>
      ))}
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
          pinColor={"#FF0000"}
        />
      )}
      {props.destination && (
        <Marker
          coordinate={props.destination}
          title="Destino"
          draggable
          onDragEnd={(e) => props.onDestinationDragEnd(e.nativeEvent.coordinate)}
          pinColor={"#00FF00"}
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