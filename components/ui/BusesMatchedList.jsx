import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import BusMatch from './BusMatch';

/**
 * Lista horizontal que muestra los colectivos que coinciden con la ruta.
 * @param {object} props - Propiedades del componente.
 * @param {array} props.matchedBuses - Array de colectivos que coinciden.
 * @param {function} props.onSelectBus - Función para manejar la selección de un bus.
 * @returns {React.Component}
 */
const BusesMatchedList = ({ matchedBuses, onSelectBus, selectedBusCod  }) => {
  if (!matchedBuses || matchedBuses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBusesText}>No se encontraron colectivos para esta ruta.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matchedBuses}
        renderItem={({ item }) => (
          <BusMatch bus={item} onPress={() => onSelectBus(item)} isSelected={item.cod === selectedBusCod} />
        )}
        keyExtractor={(item) => item.cod.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100, // Altura fija para el contenedor de la lista
    paddingVertical: 10,
  },
  listContent: {
    paddingLeft: 8,
  },
  noBusesText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 20,
  }
});

export default BusesMatchedList;