import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { formatAddress } from '../../utilities/search';
import { MAPBOX_API_TOKEN } from '../../constants/config';
import { setDestinationAddress, setOriginAddress, setDestinationSearchAddress, setOriginSearchAddress, setBottomSheetIndex } from '../../features/map/searchSlice';
import Card from '../common/Card'
import { colors } from '../../global/colors';
import { setDestination, setOrigin } from '../../features/map/mapSlice';


const SearchResult = ({ inputFocus, handleInput, bottomSheetRef }) => {
    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const { sessionKey } = useSelector(state => state.mapReducer);
    const { originSearchAddress, destinationSearchAddress } = useSelector((state) => state.searchReducer);
    const apiToken = MAPBOX_API_TOKEN;
    const iconsResults = {
        address: 'map-marker-alt',
        street: 'road',
    }

    useEffect(() => {
        let timer;
        const keyword = inputFocus === 'origin' ? originSearchAddress : destinationSearchAddress;
        const searchWithDelay = async () => {
            // Si la palabra clave no está vacía
            if (keyword.trim() !== '') {
                setIsLoadingData(true);
                try {
                    const apiUrl = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(keyword)}&language=es&country=ar&proximity=-65.20420230072014,-26.830664690007588&bbox=-65.42022029651035,-26.987638168632486,-65.00178988592451,-26.693936140528955&types=address,block,street,place,city,prefecture,neighborhood,district,locality&session_token=${sessionKey}&access_token=${apiToken}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    const dataFormatted = formatAddress(data.suggestions);
                    setSearchResults(dataFormatted);
                    setIsLoadingData(false);
                } catch (error) {
                    console.error('Error al buscar la ubicación:', error);
                    setIsLoadingData(false);
                }
            } else {
                setSearchResults([]);
                setIsLoadingData(false);
            }
        };

        const delayedSearch = () => {
            setIsLoadingData(true);
            // Limpiar el temporizador si el usuario sigue escribiendo
            clearTimeout(timer);
            timer = setTimeout(searchWithDelay, 3000); // 3 segundos de retraso
        };

        if (keyword.trim() !== '') {
            delayedSearch();
        } else {
            setSearchResults([]);
            setIsLoadingData(false);
        }

        // Limpiar el temporizador en la limpieza del efecto
        return () => clearTimeout(timer);
    }, [inputFocus, sessionKey, apiToken, originSearchAddress, destinationSearchAddress]);

    const handleResults = async (result, filter = false) => {
        if (result.feature_type === 'street' && filter) {
            const place = result.context.place.name;
            const street = result.context.street.name.replace(place, '').trim();
            handleInput(`${street}, `, street.length + 2);
            return;
        }
        try {
            const apiUrl = `https://api.mapbox.com/search/searchbox/v1/retrieve/${result.mapbox_id}?session_token=${sessionKey}&access_token=${apiToken}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            const address = result.feature_type === 'street' ?
                `${data.features[0].properties.context.street.name}, ${data.features[0].properties.context.place.name}`
                :
                (data.features[0].properties.address || data.features[0].properties.name || 'Dirección no encontrada');
            const [longitude, latitude] = data.features[0].geometry.coordinates;
            if (inputFocus === 'origin') {
                dispatch(setOriginAddress(address));
                dispatch(setOriginSearchAddress(address));
                dispatch(setOrigin({ latitude, longitude }));
            } else {
                dispatch(setDestinationAddress(address));
                dispatch(setDestinationSearchAddress(address));
                dispatch(setDestination({ latitude, longitude }));
            }
            bottomSheetRef.current.close();
        } catch (error) {
            console.error('Error al buscar la ubicación:', error);
            setIsLoadingData(false);
        }
    }


    return (
        <View additionalStyle={styles.containerResults}>
            {isLoadingData ? (
                <View style={styles.loaderMsj}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) :
                (
                    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ width: '100%', gap: 5 }}>
                        {searchResults?.length > 0 && searchResults.map((result, idx) => (
                            <View style={{ width: '100%', gap: 5 }} key={idx}>
                                <Pressable onPress={() => handleResults(result)} style={styles.containerResult}>
                                    <View style={{ justifyContent: 'center', }}>
                                        <FontAwesome5 name={iconsResults[result.feature_type] || 'map-marker-alt'} size={26} color={colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }} key={idx}>{result.name}</Text>
                                        <Text style={{ fontSize: 13, color: colors.primary }} key={result.mapbox_id} numberOfLines={1}>{result.place_formatted}</Text>
                                    </View>
                                </Pressable>
                                {result.feature_type === "street" && (
                                    <Pressable
                                        onPress={() => handleResults(result, true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#dedede",
                                            zIndex: 100,
                                            width: "100%",
                                            borderRadius: 15,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            gap: 5,
                                            paddingVertical: 2
                                        }}>
                                        <FontAwesome5 name={"plus"} size={10} color={colors.primary} />
                                        <Text style={{ fontSize: 15 }}>Agregar el numero de calle</Text>
                                    </Pressable>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                )

            }
        </View>
    )
}

export default SearchResult

const styles = StyleSheet.create({
    containerResults: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center',
        gap: 8,
    },
    containerResult: {
        alignItems: 'stretch',
        flexDirection: 'row',
        gap: 10,
    },
});