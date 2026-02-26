/**
 * TASK API SERVICE (Capa de Datos)
 * * Esta capa actúa como una abstracción sobre las peticiones HTTP, manteniendo
 * la lógica de negocio (Services/Hooks) desacoplada de la implementación del cliente.
 * * Sigue el principio de Responsabilidad Única (SOLID): su único propósito es
 * definir y ejecutar las llamadas a los endpoints de tareas. 
 */

import { apiClient } from "./client";
import { TodoResponse } from "../types/api";

export const taskApi = {
    /**
     * Obtiene la lista completa de tareas desde el servidor externo.
     * * NOTA: En la implementación del SyncService, se recomienda añadir
     * el parámetro '?limit=0' a este endpoint para garantizar la descarga de 
     * los 150 registros solicitados en los requisitos funcionales.
     * * @returns {Promise<TodoResponse>} Promesa con la estructura de datos de DummyJSON.
     */
    fetchAllTasks: async (): Promise<TodoResponse> => {
        try {
            // Se delega la ejecución al cliente centralizado para heredar
            // la configuración de headers y el manejo de errores global.
            return await apiClient.get('/todos');
        } catch (error) {
            // Re-lanzamos el error para que sea gestionado por la capa de sincronización
            // garantizando la resiliencia en escenarios sin conexión. 
            throw error;
        }
    },
};