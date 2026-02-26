/**
 * NAVIGATION TYPES (Capa de Tipado Global)
 * * Este archivo define el contrato de navegación para toda la aplicación.
 * * El uso de un 'ParamList' centralizado permite:
 * 1. Type-Safety: TypeScript validará que solo naveguemos a rutas existentes.
 * 2. Validación de Parámetros: Asegura que, si una pantalla requiere datos (como un ID), 
 * estos sean pasados obligatoriamente durante la navegación.
 * 3. Autocompletado: Facilita el desarrollo al proveer sugerencias precisas en el hook 'useNavigation'.
 */

export type RootStackParamList = {
    /**
     * Dashboard: Pantalla principal. 
     * Se define como 'undefined' porque no requiere parámetros iniciales para renderizarse.
     */
    Dashboard: undefined;

    /**
     * Camera: Pantalla de captura de adjuntos.
     * A diferencia del Dashboard, esta ruta es paramétrica. 
     * @param taskId Identificador único de la tarea de WatermelonDB. 
     * Es obligatorio para poder vincular la fotografía capturada con su entidad 
     * correspondiente en la base de datos local (Requisito de persistencia).
     */
    Camera: { taskId: string }; 
};