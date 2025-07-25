import { StyleSheet, Platform, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
// Importa los stacks que crearemos en etapas posteriores
import HomeStack from './HomeStack';
import BusStack from './BusStack';
import LikesStack from './LikesStack';
// import UserStack from './UserStack'; // Si se implementará la pantalla de usuario

import { colors } from '../constants/colors'; // Ajustar ruta

const Tab = createBottomTabNavigator();

// Componente para los íconos de las pestañas
const TabIcon = ({ focused, icon }) =>
    <View>
        <FontAwesome5 name={icon} size={24} color={focused ? colors.accent : "white"} />
    </View>

const AppNavigator = () => {
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='Home' // La pantalla de inicio será Home
                    screenOptions={{
                        headerShown: false, // Ocultar el encabezado por defecto en todos los stacks
                        tabBarStyle: styles.tabBar,
                        tabBarLabelStyle: styles.tabsText,
                        tabBarItemStyle: styles.tabsContainer
                    }}
                >
                    <Tab.Screen
                        name='Home'
                        component={HomeStack}
                        options={{
                            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" />,
                            tabBarLabel: 'Inicio' // Etiqueta de la pestaña
                        }}
                    />
                    <Tab.Screen
                        name='Buses'
                        component={BusStack}
                        options={{
                            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="bus" />,
                            tabBarLabel: 'Colectivos'
                        }}
                    />
                    <Tab.Screen
                        name='Likes'
                        component={LikesStack}
                        options={{
                            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="heart" />,
                            tabBarLabel: 'Favoritos'
                        }}
                    />
                    {/* Si se implementará la pantalla de usuario */}
                    {/* <Tab.Screen
                        name='User'
                        component={UserStack}
                        options={{
                            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="user-alt" />,
                            tabBarLabel: 'Usuario'
                        }}
                    /> */}
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default AppNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Ajuste del paddingTop para la barra de estado en Android.
        // `Platform.OS === 'android' ? StatusBar.currentHeight : 0` asegura que solo se aplique en Android.
        /* paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, */
    },
    tabBar: {
        height: 70,
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderTopWidth: 0, // Eliminar la línea superior del tabBar
        elevation: 10, // Sombra para Android
        shadowColor: "#000", // Sombra para iOS
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    tabsContainer: {
        paddingVertical: 8
    },
    tabsText: {
        fontSize: 12,
        color: "white"
    },
});