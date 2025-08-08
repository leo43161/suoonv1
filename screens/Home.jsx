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
                <Text style={styles.headerTitle}>SUOON</Text>
            </View>

            {/* Barra de búsqueda */}
            <Card additionalStyle={styles.searchBar}>
                <FontAwesome5 name="search" size={20} color="black" />
                <TouchableOpacity onPress={onSearchPress} style={styles.searchInputTouchable}>
                    <Text style={styles.searchInputPlaceholder}>Hacia donde vas?</Text>
                </TouchableOpacity>
            </Card>

            {/* Título "Encuentra" con card outline */}
            <TouchableOpacity onPress={onSearchPress} style={styles.findSection}>
                <Text style={styles.sectionTitle}>Encuentra</Text>
                <Card additionalStyle={styles.findCard}>
                    <Image
                        source={require('../assets/img/mapas_historica.png')} // Placeholder de imagen de mapa
                        style={styles.findCardImage}
                    />
                    <View style={styles.findCardTextContainer}>
                        <Text style={styles.findCardTitle}>Encuentra tu colectivo</Text>
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
                                <View style={styles.popularBusContent}>
                                    <View style={styles.popularBusThumbnail}>
                                        <FontAwesome5 name="bus" size={30} color={colors.primary} />
                                    </View>
                                    <View style={styles.popularBusTextContainer}>
                                        <Text style={styles.popularBusTitle}>Línea {bus.linea}</Text>
                                        <Text style={styles.popularBusSubtitle}>{bus.descripcion}</Text>
                                    </View>
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
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.dark,
    },
    searchBar: {
        marginHorizontal: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: colors.light, // Puedes ajustar el color de fondo de la barra de búsqueda
    },
    searchInputPlaceholder: {
        fontSize: 18,
        color: colors.dark,
        flex: 1,
        textAlign: 'center',
    },
    searchInputTouchable: {
        flex: 1,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 15,
    },
    findSection: {
        paddingHorizontal: 15,
    },
    findCard: {
        width: '100%',
        padding: 0, // Eliminar padding para que la imagen ocupe todo el ancho
        overflow: 'hidden', // Asegurar que la imagen no se desborde
    },
    findCardImage: {
        width: '100%',
        height: 150, // Altura fija para la imagen del mapa
        resizeMode: 'cover',
    },
    findCardTextContainer: {
        padding: 15,
    },
    findCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 5,
    },
    findCardSubtitle: {
        fontSize: 16,
        color: colors.primary,
    },
    popularBusesSection: {
        paddingBottom: 20,
    },
    popularBusesList: {
        paddingHorizontal: 15,
        gap: 10, // Espacio entre las cards
    },
    popularBusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%', // Asegura que la card ocupe todo el ancho
    },
    popularBusThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: colors.light, // Fondo del thumbnail
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    popularBusTextContainer: {
        flex: 1,
    },
    popularBusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    popularBusSubtitle: {
        fontSize: 14,
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
});