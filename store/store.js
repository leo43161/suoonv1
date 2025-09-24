import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import mapReducer from '../features/map/mapSlice';
import searchReducer from '../features/map/searchSlice';
import busesReducer from '../features/buses/busesSlice';
import likesReducer from '../features/likes/likesSlice';
import { busesApi } from "../services/api/busesApi";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['likesReducer'],
};

const rootReducer = combineReducers({
    mapReducer,
    searchReducer,
    busesReducer,
    likesReducer,
    [busesApi.reducerPath]: busesApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            immutableCheck: false,
        }).concat(busesApi.middleware)
})

setupListeners(store.dispatch)

const persistor = persistStore(store);

export { store, persistor };