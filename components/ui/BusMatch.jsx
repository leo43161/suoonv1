import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from '../common/Card'; // Reutilizamos el componente Card
import {colors} from '../../global/colors';

/**
 * Tarjeta individual para un colectivo que coincide en la búsqueda.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.bus - Datos del colectivo ({ linea, descripcion }).
 * @param {function} props.onPress - Función a ejecutar al presionar la tarjeta.
 * @returns {React.Component}
 */
const BusMatch = ({ bus, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.linea}>{bus.linea}</Text>
        <Text style={styles.descripcion}>{bus.descripcion}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginHorizontal: 8,
    backgroundColor: colors.light,
    width: 120, // Ancho fijo para la lista horizontal
    alignItems: 'center',
  },
  linea: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.dark,
  },
  descripcion: {
    fontSize: 12,
    color: colors.dark,
    textAlign: 'center',
  },
});

export default BusMatch;