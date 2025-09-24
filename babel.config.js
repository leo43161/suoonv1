module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... otros plugins que puedas tener
      'react-native-reanimated/plugin', // Reanimated debe ser el ÚLTIMO plugin.
    ],
  };
};