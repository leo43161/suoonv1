import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { colors } from '../global/colors';
import Card from '../components/common/Card';
import { FontAwesome5 } from '@expo/vector-icons';
import BusesData from '../data/Buses.json'; // Importa tus datos de buses
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();

    const popularBuses = BusesData.slice(0, 4); // Tomar los primeros 5 colectivos como "populares"

    const onSearchPress = () => {
        navigation.navigate('Maps'); // Navegar a la pantalla Maps al hacer click en la barra de búsqueda
    };

    const onSeeMoreBuses = () => {
        navigation.navigate('Buses'); // Navegar a la pantalla Buses
    };

    const onSelectBus = (bus) => {
        navigation.navigate('BusesMap', { busCod: bus.cod }); // Navegar al mapa del colectivo
    };
    return (
        <ScrollView style={styles.container}>
            {/* Parte de arriba con título */}
            <View style={styles.header}>
                <Image
                    source={require('../assets/img/suoon-icon.png')} // Placeholder de imagen de mapa
                    style={{ width: 70, height: 33, marginBottom: 2 }}
                />
                <Text style={styles.headerTitle}>Suoon</Text>
            </View>

            {/* Barra de búsqueda */}
            <Card additionalStyle={styles.searchBar}>
                <FontAwesome5 name="search" size={21} color="black" />
                <TouchableOpacity onPress={onSearchPress} style={styles.searchInputTouchable}>
                    <Text style={styles.searchInputPlaceholder}>Hacia donde vas?</Text>
                </TouchableOpacity>
            </Card>

            {/* Título "Encuentra" con card outline */}
            <TouchableOpacity onPress={onSearchPress} style={styles.findSection}>
                <Text style={styles.sectionTitle}>Encuentra</Text>
                <Card additionalStyle={[styles.findCard, styles.shadow]}>
                    <Image
                        source={require('../assets/img/mapas_historica.png')} // Placeholder de imagen de mapa
                        style={styles.findCardImage}
                    />
                    <View style={styles.findCardTextContainer}>
                        <Text style={styles.findCardTitle}>Encontrá tu colectivo</Text>
                        <Text style={styles.findCardSubtitle}>
                            Encuentra tu colectivo ideal para llegar a tu destino
                        </Text>
                    </View>
                </Card>
            </TouchableOpacity>

            {/* Título "Colectivos populares" y lista de cards */}
            <View style={styles.popularBusesSection}>
                <Text style={styles.sectionTitle}>Colectivos populares</Text>
                <View style={styles.popularBusesList}>
                    {popularBuses.map((bus, index) => (
                        <View key={index}>
                            <Card additionalStyle={styles.popularBusCard} onPress={() => onSelectBus(bus)}>
                                <View style={styles.popularBusThumbnail}>
                                    <FontAwesome5 name="bus" size={30} color={colors.primary} />
                                </View>
                                <View style={styles.popularBusTextContainer}>
                                    <Text style={styles.popularBusTitle}>Línea {bus.linea}</Text>
                                    <Text style={styles.popularBusSubtitle}>{bus.descripcion}</Text>
                                </View>
                            </Card>
                        </View>
                    ))}
                    <TouchableOpacity onPress={onSeeMoreBuses} style={styles.seeMoreButton}>
                        <Text style={styles.seeMoreButtonText}>Ver más colectivos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 15,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '400',
        color: colors.light,
        letterSpacing: 1,
    },
    searchBar: {
        marginHorizontal: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: colors.light, // Puedes ajustar el color de fondo de la barra de búsqueda
    },
    searchInputPlaceholder: {
        fontSize: 22,
        color: "#8a8a8aff",
        flex: 1,
        textAlign: 'center',
        fontWeight: 'semibold',
        fontStyle: 'italic',
        paddingVertical: 2,
    },
    searchInputTouchable: {
        flex: 1,
        alignItems: 'flex-start',
        paddingStart: 12,
    },
    sectionTitle: {
        fontSize: 29,
        fontWeight: 500,
        color: colors.light,
        marginTop: 20,
        marginBottom: 18,
    },
    findSection: {
        paddingHorizontal: 17,
    },
    findCard: {
        width: '100%',
        padding: 18,
        overflow: 'hidden',
        backgroundColor: colors.dark,
        borderWidth: 2,
        borderColor: colors.light,
        borderRadius: 27,
    },
    findCardImage: {
        width: '100%',
        height: 160, // Altura fija para la imagen del mapa
        resizeMode: 'cover',
        borderRadius: 15,
        marginBottom: 7,
    },
    findCardTextContainer: {
        paddingHorizontal: 2,
    },
    findCardTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: colors.light,
        marginBottom: 2,
    },
    findCardSubtitle: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: '400',
    },
    popularBusesSection: {
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    popularBusesList: {
        gap: 15, // Espacio entre las cards
    },
    popularBusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%', // Asegura que la card ocupe todo el ancho
        gap: 15
    },
    popularBusThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: colors.dark, // Fondo del thumbnail
        justifyContent: 'center',
        alignItems: 'center',
    },
    popularBusTextContainer: {
        flex: 1,
    },
    popularBusTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
    },
    popularBusSubtitle: {
        fontSize: 16,
        color: colors.dark,
    },
    seeMoreButton: {
        backgroundColor: colors.secondary, // Un color que contraste
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: 'center', // Centrar el botón
        marginTop: 20,
        marginBottom: 30
    },
    seeMoreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    shadow: {
        shadowColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
});