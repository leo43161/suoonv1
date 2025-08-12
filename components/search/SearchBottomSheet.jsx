import React, { forwardRef, useMemo } from 'react';
// Asegúrate de importar TouchableOpacity
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
const SearchBottomSheet = forwardRef(({ index, onChange, originAddress, onSwapPress  }, ref) => {
    const snapPoints = useMemo(() => ['45%', '50%', '90%'], []);

    return (
        <BottomSheet
            ref={ref}
            index={index}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={onChange}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text style={styles.title}>Planifica tu viaje</Text>

                <View style={styles.searchContainer}>
                    <View style={styles.inputsColumn}>
                        <View style={styles.inputContainer}>
                            <Text>Origen</Text>
                            <TextInput style={styles.input} value={originAddress} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Destino</Text>
                            <TextInput style={styles.input} placeholder="Escribe una dirección" />
                        </View>
                    </View>

                    {/* --- NUEVO BOTÓN DE INTERCAMBIO --- */}
                    <TouchableOpacity style={styles.swapButton} onPress={onSwapPress}>
                        <Ionicons name="swap-vertical" size={24} color="#555" />
                    </TouchableOpacity>
                </View>

            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputsColumn: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        fontSize: 16,
    },
    swapButton: {
        padding: 10,
        marginLeft: 10,
    }
});

export default SearchBottomSheet;