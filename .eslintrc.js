module.exports = {
  env: {
    node: true,
    'jest/globals': true, // <--- Esto habilita las globales de Jest como 'jest' o 'test'
  },
  plugins: ['jest'],
  extends: [
    'eslint:recommended',
      '@react-native',

    'plugin:jest/recommended', // Opcional: añade mejores prácticas de tests
  ],
  // ... resto de tu configuración
};