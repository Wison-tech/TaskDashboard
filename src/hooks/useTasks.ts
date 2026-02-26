/**
 * CUSTOM HOOK: useTasks (Capa de Orquestación de Datos)
 * * Este hook actúa como el puente entre los componentes de la interfaz (UI) 
 * y la lógica de sincronización (SyncService).
 * * Responsabilidades Senior:
 * 1. Gestión de Estado de Carga (Loading State): Proporciona feedback visual 
 * al usuario durante procesos asíncronos pesados (sincronización de 150 registros).
 * 2. Abstracción de Efectos: Encapsula el manejo de errores y ciclos de vida
 * para mantener los componentes de pantalla (Screens) limpios y declarativos.
 * 3. Optimización: Utiliza useCallback para garantizar estabilidad referencial
 * en funciones que se pasan a componentes hijos o listas.
 */

import { useState, useCallback } from "react";
import { syncTaskFromApi } from '../services/SyncService';

export const useTasks = () => {
  /**
   * isSyncing: Estado booleano que controla los indicadores de carga (Spinners/RefreshControl).
   * Es vital para cumplir con el criterio de "experiencia de usuario fluida".
   */
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * handleRefresh: Ejecuta la lógica de sincronización masiva.
   * Se utiliza useCallback para evitar re-renders innecesarios en el Dashboard.
   */
  const handleRefresh = useCallback(async () => {
    setIsSyncing(true);
    try {
      /**
       * Inicia la descarga y persistencia de las 150 tareas desde DummyJSON.
       * Este proceso es atómico gracias al uso de 'batch' en el Service.
       */
      await syncTaskFromApi();
    } catch (error) {
      /**
       * GESTIÓN DE ERRORES (Resiliencia):
       * En una arquitectura offline-first, un error de red no debe romper la app.
       * Aquí se captura el fallo para evitar cierres inesperados, permitiendo 
       * que el usuario siga trabajando con los datos ya persistidos en SQLite.
       */
      console.error("[SYNC_ERROR]: Error durante la sincronización de tareas", error);            
    } finally {
      // Garantizamos que el estado de carga se limpie independientemente del resultado.
      setIsSyncing(false);
    }
  }, []);

  return { 
    isSyncing, 
    handleRefresh 
  };
};