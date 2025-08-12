import React, { forwardRef, useMemo } from 'react';
import { Text, StyleSheet, TextInput, View } from 'react-native';
// Importamos BottomSheetView además de BottomSheet
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
const SearchBottomSheet = forwardRef(({ index, onChange }, ref) => {
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    return (
        <BottomSheet
            ref={ref}
            index={index}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={onChange}
        >
            {/* Cambiamos View por BottomSheetView */}
            <BottomSheetView style={styles.contentContainer}>
                <Text style={styles.title}>Planifica tu viaje</Text>
                {/* ... inputs ... */}
                <View style={styles.inputContainer}>
                    <Text>Origen</Text>
                    <TextInput style={styles.input} placeholder="Ubicación actual" />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Destino</Text>
                    <TextInput style={styles.input} placeholder="Escribe una dirección" />
                </View>
            </BottomSheetView>
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