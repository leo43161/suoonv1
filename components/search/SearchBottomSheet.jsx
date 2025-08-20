import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

// Añadimos la prop 'activeInput'
const SearchBottomSheet = forwardRef(({ index, onChange, originAddress, handleSwap, activeInput }, ref) => {
    const snapPoints = useMemo(() => ['60%','90%'], []);
    
    // Refs para los inputs
    const originInputRef = useRef(null);
    const destinationInputRef = useRef(null);

    // Efecto para enfocar el input correcto cuando se abre el panel
    useEffect(() => {
        // Si el panel está abierto (index >= 0)
        if (index >= 0) {
            // Damos un pequeño delay para asegurar que el input sea visible antes de enfocarlo
            setTimeout(() => {
                if (activeInput === 'origin') {
                    originInputRef.current?.focus();
                } else if (activeInput === 'destination') {
                    destinationInputRef.current?.focus();
                }
            }, 100);
        }
    }, [index, activeInput]); // Se ejecuta cuando el panel se abre/cierra o el input activo cambia

    return (
        <BottomSheet
            ref={ref}
            index={index}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={onChange}
        >
            <BottomSheetView style={styles.contentContainer}>
                {/* ... (título y contenedor de búsqueda) */}
                <View style={styles.searchContainer}>
                    <View style={styles.inputsColumn}>
                        <View style={styles.inputContainer}>
                            <Text>Origen</Text>
                            <TextInput placeholderTextColor={'#ccc'} ref={originInputRef} style={styles.input} value={originAddress} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text>Destino</Text>
                            <TextInput placeholderTextColor={'#ccc'} ref={destinationInputRef} style={styles.input} placeholder="Escribe una dirección" />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
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
        color: '#000',
    },
    swapButton: {
        padding: 10,
        marginLeft: 10,
    }
});

export default SearchBottomSheet;