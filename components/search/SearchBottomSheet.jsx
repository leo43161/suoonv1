import React, { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import SearchResult from './SearchResult';
import { swapOriginDestination } from '../../features/map/mapSlice';
import { setDestinationAddress, setOriginAddress, setDestinationSearchAddress, setOriginSearchAddress } from '../../features/map/searchSlice';
import { useDispatch, useSelector } from 'react-redux';

// Añadimos la prop 'activeInput'
const SearchBottomSheet = forwardRef(({ index, onChange, activeInput }, ref) => {
    const dispatch = useDispatch();
    const { originSearchAddress, destinationSearchAddress, destinationAddress } = useSelector((state) => state.searchReducer);
    const snapPoints = useMemo(() => ['60%', '90%'], []);
    const [onFocusInput, setOnFocusInput] = useState(null);
    const [cursorPosition, setCursorPosition] = useState(null);

    // Refs para los inputs
    const originInputRef = useRef(null);
    const destinationInputRef = useRef(null);

    // Efecto para enfocar el input correcto cuando se abre el panel
    useEffect(() => {
        // Si el panel está abierto (index >= 0)
        if (index >= 0) {
            // Damos un pequeño delay para asegurar que el input sea visible antes de enfocarlo
            setTimeout(() => {
                destinationInputRef.current?.focus();
                if (activeInput === 'origin') {
                    originInputRef.current?.focus();
                } else if (activeInput === 'destination') {
                    destinationInputRef.current?.focus();
                }
            }, 100);
        }
    }, [index, activeInput]); // Se ejecuta cuando el panel se abre/cierra o el input activo cambia

    useEffect(() => {
        if (cursorPosition !== null) {
            if (onFocusInput === 'origin' && originInputRef.current) {
                originInputRef.current.focus();
                originInputRef.current.setSelection(cursorPosition, cursorPosition);
            }
            if (onFocusInput === 'destino' && destinationInputRef.current) {
                destinationInputRef.current.focus();
                destinationInputRef.current.setSelection(cursorPosition, cursorPosition);
            }
            setCursorPosition(null);
        }
    }, [cursorPosition]);

    const handleInput = (value, cursorPosition) => {
        if (onFocusInput === 'origin') {
            originInputRef.current.focus();
            dispatch(setOriginSearchAddress(value));
        } else if (onFocusInput === 'destino') {
            destinationInputRef.current.focus();
            dispatch(setDestinationSearchAddress(value));
        }
        setCursorPosition(cursorPosition);
    };

    const handleSwap = () => {
        dispatch(swapOriginDestination());
        const tempAddress = originSearchAddress;
        dispatch(setOriginAddress(destinationSearchAddress));
        dispatch(setDestinationAddress(tempAddress));
    };
    const deleteInput = () => {
        if (onFocusInput === 'origin') {
            dispatch(setOriginSearchAddress(''));
        } else if (onFocusInput === 'destino') {
            dispatch(setDestinationSearchAddress(''));
        }
    };

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
                <View>
                    <View style={styles.searchContainer}>
                        <View style={styles.inputsColumn}>
                            <View style={styles.inputContainer}>
                                <Text>Origen</Text>
                                <TextInput
                                    placeholderTextColor={'#ccc'}
                                    ref={originInputRef}
                                    onFocus={() => setOnFocusInput('origin')}
                                    onChange={(e) => dispatch(setOriginSearchAddress(e.nativeEvent.text))}
                                    style={styles.input}
                                    value={originSearchAddress}
                                />
                                {onFocusInput === 'origin' && originSearchAddress !== '' &&
                                    <TouchableOpacity style={styles.cleanIcon} onPress={deleteInput}>
                                        <Ionicons name="close" size={24} color="#555" />
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text>Destino</Text>
                                <TextInput
                                    placeholderTextColor={'#ccc'}
                                    ref={destinationInputRef}
                                    onFocus={() => setOnFocusInput('destino')}
                                    style={styles.input}
                                    placeholder="Escribe una dirección"
                                    onChange={(e) => dispatch(setDestinationSearchAddress(e.nativeEvent.text))}
                                    value={destinationSearchAddress}
                                />
                                {onFocusInput === 'destino' && destinationSearchAddress !== '' &&
                                    <TouchableOpacity style={styles.cleanIcon} onPress={deleteInput}>
                                        <Ionicons name="close" size={24} color="#555" />
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        {destinationAddress !== '' &&
                            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
                            <Ionicons name="swap-vertical" size={24} color="#555" />
                        </TouchableOpacity>
                        }
                    </View>
                    <View>
                        <SearchResult inputFocus={onFocusInput} handleInput={handleInput} />
                    </View>
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
    },
    cleanIcon: {
        position: 'absolute',
        top: 10,
        right: 0,
        backgroundColor: 'white',
        height: "100%",
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default SearchBottomSheet;