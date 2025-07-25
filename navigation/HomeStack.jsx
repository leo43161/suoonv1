import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='HomeScreen' component={Home} />
        </Stack.Navigator>
    )
}

export default HomeStack;