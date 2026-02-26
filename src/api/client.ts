/**
 * API CLIENT (Capa de Infraestructura)
 * * Se implementa un cliente centralizado utilizando el Fetch API para:
 * 1. Definir la URL base de DummyJSON como única fuente de verdad[cite: 24, 28].
 * 2. Configurar cabeceras comunes y estandarizar la comunicación.
 * 3. Facilitar la interceptación y el manejo global de errores de red.
 * * Esta abstracción permite que el resto de la aplicación no dependa de la 
 * implementación de red, facilitando la testabilidad y el mantenimiento.
 */

const BASE_URL = 'https://dummyjson.com';

export const apiClient = {
    /**
     * Realiza peticiones GET estandarizadas.
     * @param endpoint Ruta del recurso (ej: '/todos')
     * @returns Promesa con los datos parseados en formato JSON.
     */
    get: async (endpoint: string) => {
        try {
            // Se construye la URL completa uniendo la base y el endpoint específico.
            const response = await fetch(`${BASE_URL}${endpoint}`);

            // Validación de la respuesta HTTP (status codes 200-299).
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            // Retorno de datos transformados para su posterior persistencia local.
            return await response.json();
            
        } catch (error) {
            /**
             * ESTRATEGIA OFFLINE-FIRST:
             * Los errores de red se capturan aquí para ser propagados al SyncService[cite: 30, 82].
             * Esto permite que la aplicación decida si trabajar con el caché local de 
             * WatermelonDB o mostrar una notificación de reintento al usuario[cite: 31, 33].
             */
            console.error('[API_CLIENT_ERROR]:', error);
            throw error;
        }
    },
};