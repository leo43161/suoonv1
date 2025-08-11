import React, { forwardRef, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const SearchBottomSheet = forwardRef((props, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    return (
        <BottomSheet
            ref={ref}
            index={-1} // Comienza cerrado
            snapPoints={snapPoints}
            enablePanDownToClose={true}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Planifica tu viaje</Text>
                <View style={styles.inputContainer}>
                    <Text>Origen</Text>
                    <TextInput style={styles.input} placeholder="Ubicación actual" />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Destino</Text>
                    <TextInput style={styles.input} placeholder="Escribe una dirección" />
                </View>
            </View>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        fontSize: 16,
    }
});

export default SearchBottomSheet;