// Reads the Google Maps key from the environment so it is never committed.
// Set GOOGLE_MAPS_API_KEY in your shell, .env, or EAS secrets before building.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...(config.android && config.android.config),
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
    },
  },
});
