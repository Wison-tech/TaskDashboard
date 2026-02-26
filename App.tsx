/**
 * PUNTO DE ENTRADA PRINCIPAL: App.tsx
 * * Este componente configura el árbol de dependencias global.
 * Se implementa la arquitectura 'Offline-First' al inyectar la base de datos 
 * en el nivel más alto de la aplicación[cite: 22, 30].
 */

import React from 'react';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from './src/database'; // Instancia única (Singleton) de WatermelonDB [cite: 21]
import { DashboardScreen } from './src/screens/DashboardScreen';

/**
 * El componente App envuelve la UI en un Provider reactivo.
 * Esto permite que cualquier componente hijo observe cambios en la base de datos
 * local sin necesidad de llamadas manuales a la API.
 */
export default function App() {
  return (
    /**
     * DatabaseProvider:
     * Provee la instancia de WatermelonDB al árbol de componentes.
     * Es crucial para que @nozbe/watermelondb/withObservables funcione,
     * garantizando una experiencia de usuario fluida y reactiva[cite: 6, 41].
     */
    <DatabaseProvider database={database}>
      {/* DashboardScreen: Pantalla principal que renderiza la lista de tareas [cite: 37] */}
      <DashboardScreen />
    </DatabaseProvider>
  );
}