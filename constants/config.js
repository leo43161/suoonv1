// Aquí irán tus API keys y URLs de servicios externos
// Para un proyecto real, estas claves NO deberían estar en el código fuente.
// Usar variables de entorno de Expo (app.json "extra" y EAS secrets) es lo recomendable.
// Por ahora, las colocamos aquí para facilitar el desarrollo.

// Clave de API pública de Mapbox para el servicio de geocodificación (Searchbox v1)
export const MAPBOX_API_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_API_TOKEN || 'YOUR_MAPBOX_PUBLIC_ACCESS_TOKEN';

// URL base de la API de TucuBus para los datos de colectivos
export const TUCUBUS_API_URL = 'https://tucuman.miredbus.com.ar/rest/';

// Clave de API de Google Maps para react-native-maps (necesaria para Android y iOS si usas PROVIDER_GOOGLE)
// Asegúrate de que esta clave esté restringida a tus IDs de paquete/bundle y huellas SHA-1.
export const Maps_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'YOUR_Maps_API_KEY';