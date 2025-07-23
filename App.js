import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';

// Habilitar el renderizador más reciente para react-native-maps
import { enableLatestRenderer } from 'react-native-maps';
enableLatestRenderer();

// Polyfill para `crypto.randomUUID()` si se usa `expo-crypto` con algunas versiones de Node o entornos específicos
import 'react-native-get-random-values';


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Cargando...</Text>} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}