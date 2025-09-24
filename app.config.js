// Importa y configura dotenv al principio de todo.
require('dotenv').config();

// Exporta la configuración de la app.
export default ({ config }) => {
  return {
    // Usa el operador '...' para copiar toda la configuración original que tenías.
    ...config,
    
    // Aquí puedes sobreescribir o añadir valores específicos.
    ios: {
      ...config.ios, // Mantenemos la configuración existente de iOS
      config: {
        ...config.ios.config,
        // Reemplazamos la API key con la variable de entorno.
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    },
    android: {
      ...config.android, // Mantenemos la configuración existente de Android
      config: {
        ...config.android.config,
        googleMaps: {
          // Reemplazamos la API key con la variable de entorno.
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        },
      },
    },
    extra: {
      ...config.extra, // Mantenemos la configuración existente en 'extra'
      // Reemplazamos las keys en 'extra' con las variables de entorno.
      EXPO_PUBLIC_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      EXPO_PUBLIC_MAPBOX_API_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_API_TOKEN,
    },
    // No necesitas reescribir todo el JSON, solo las partes que cambian.
    // El resto de tu configuración original (name, slug, version, etc.) 
    // se mantiene gracias a '...config'.
    name: "suoon-app",
    slug: "suoon",
  };
};