module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@nozbe/watermelondb|@nozbe/with-observables)/',
  ],
  // Eliminamos el mapper problemático y dejamos que el preset resuelva las rutas
};