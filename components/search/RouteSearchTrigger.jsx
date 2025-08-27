import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../global/colors'; // Asumiendo que tienes un archivo de colores globales
import { useSelector } from 'react-redux';

const RouteSearchTrigger = ({ onOriginPress, onDestinationPress }) => {
    const { originAddress, destinationAddress } = useSelector((state) => state.searchReducer);
    return (
        <View style={styles.container}>
            {/* La línea punteada y los círculos para el detalle visual */}
            <View style={styles.routeLineContainer}>
                <View style={[styles.square, styles.originCircle]} />
                <View style={styles.dottedLine} />
                <View style={[styles.circle, styles.destinationCircle]} />
            </View>

            <View style={styles.inputsContainer}>
                {/* Campo de Origen */}
                <Pressable style={styles.pressableInput} onPress={onOriginPress}>
                    <Text numberOfLines={1} style={styles.inputText}>
                        {originAddress || 'Seleccionar origen'}
                    </Text>
                </Pressable>

                <View style={styles.separator} />

                {/* Campo de Destino */}
                <Pressable style={styles.pressableInput} onPress={onDestinationPress}>
                    <Text numberOfLines={1} style={[styles.inputText, !destinationAddress && styles.placeholder]}>
                        {destinationAddress || '¿Hacia donde vas?'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    routeLineContainer: {
        width: 20,
        height: '100%',
        alignItems: 'center',
        marginRight: 10,
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 10,
    },
    square: {
        width: 18,
        height: 18,
    },
    destinationCircle: {
        backgroundColor: colors.dark || 'blue',
        borderWidth: 6,
        borderColor: colors.primary || 'black',
    },
    originCircle: {
        backgroundColor: colors.primary || 'black',
        borderWidth: 6,
        borderColor: colors.dark || 'black',
    },
    dottedLine: {
        flex: 1,
        width: 1,
        borderLeftWidth: 3,
        borderLeftColor: '#000',
        /* borderStyle: 'dotted', */
    },
    inputsContainer: {
        flex: 1,
        gap: 10
    },
    pressableInput: {
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    placeholder: {
        color: '#888',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
});

export default RouteSearchTrigger;