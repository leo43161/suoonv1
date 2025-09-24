// EN: components/ui/BusMatch.jsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../global/colors';

const BusMatch = ({ bus, onPress, isSelected }) => {
  // El estilo del contenedor cambiará si el bus está seleccionado
  const containerStyle = [
    styles.container,
    isSelected ? styles.selectedContainer : styles.normalContainer
  ];

  const textStyle = isSelected ? styles.selectedText : styles.normalText;

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={[styles.lineaText, textStyle]}>Línea {bus.linea}</Text>
      <Text style={[styles.ramalText, textStyle]} numberOfLines={1}>{bus.descripcion}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    minWidth: 120,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  normalContainer: {
    backgroundColor: '#fff',
  },
  selectedContainer: {
    backgroundColor: colors.primary, // Usa tu color primario para el fondo
    borderWidth: 2,
    borderColor: colors.dark, // Un borde para destacar aún más
  },
  lineaText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  ramalText: {
    fontSize: 12,
    textAlign: 'center',
  },
  normalText: {
    color: colors.dark,
  },
  selectedText: {
    color: '#fff', // Texto blanco para que contraste con el fondo primario
    fontWeight: 'bold',
  },
});

export default BusMatch;