import React, { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import SearchResult from './SearchResult';
import { swapOriginDestination } from '../../features/map/mapSlice';
import { setDestinationAddress, setOriginAddress, setDestinationSearchAddress, setOriginSearchAddress } from '../../features/map/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../global/colors';

// Añadimos la prop 'activeInput'
const SearchBottomSheet = forwardRef(({ index, onChange, activeInput, setSheetIndex }, ref) => {
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
            handleStyle={{ backgroundColor: colors.primary, borderTopStartRadius: 10, borderTopEndRadius: 10 }}
            backgroundStyle={styles.bottomSheet}
        >
            <BottomSheetView style={styles.contentContainer}>
                {/* ... (título y contenedor de búsqueda) */}
                <View >
                    <View style={styles.searchContainer}>
                        <View style={styles.inputsColumn}>
                            <Text style={[styles.whiteText, styles.titleDestination]}>Origen</Text>
                            <View style={styles.inputContainer}>
                                <View style={[styles.square, styles.originCircle]} />
                                <TextInput
                                    placeholderTextColor={'#ccc'}
                                    ref={originInputRef}
                                    onFocus={() => setOnFocusInput('origin')}
                                    onChange={(e) => dispatch(setOriginSearchAddress(e.nativeEvent.text))}
                                    style={[styles.input,/*  styles.whiteText */]}
                                    value={originSearchAddress}
                                />
                                {onFocusInput === 'origin' && originSearchAddress !== '' &&
                                    <TouchableOpacity style={styles.cleanIcon} onPress={deleteInput}>
                                        <Ionicons name="close" size={24} color="#555" />
                                    </TouchableOpacity>
                                }
                            </View>
                            <Text style={[styles.whiteText, styles.titleDestination]}>Destino</Text>
                            <View style={styles.inputContainer}>
                                <View style={[styles.circle, styles.destinationCircle]} />
                                <TextInput
                                    placeholderTextColor={'#ccc'}
                                    ref={destinationInputRef}
                                    onFocus={() => setOnFocusInput('destino')}
                                    style={[styles.input, styles.whiteText]}
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
                        <SearchResult bottomSheetRef={ref} inputFocus={onFocusInput} handleInput={handleInput} />
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheet: {
        backgroundColor: colors.dark
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    titleDestination: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
    },
    whiteText: {
        color: colors.light,
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
        backgroundColor: colors.light,
        paddingHorizontal: 18,
        paddingVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    input: {
        borderColor: '#ccc',
        paddingVertical: 8,
        fontSize: 24,
        color: colors.dark,
        flex: 1
    },
    swapButton: {
        padding: 10,
        marginLeft: 10,
    },
    cleanIcon: {
        position: 'absolute',
        top: 6,
        right: 10,
        backgroundColor: 'transparent',
        height: "100%",
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    square: {
        width: 20,
        height: 20,
         borderRadius: 3,
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
});

export default SearchBottomSheet;