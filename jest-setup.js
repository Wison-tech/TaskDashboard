import '@testing-library/jest-native/extend-expect';

// COMENTA O ELIMINA ESTA LÍNEA QUE CAUSA EL ERROR
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock de WatermelonDB para que los tests unitarios no busquen SQLite real
jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return jest.fn().mockImplementation(() => ({
    schema: {},
    dbName: 'test',
  }));
});

// Mock global de fetch para los tests de sincronización
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ todos: [] }),
  })
);