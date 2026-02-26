/**
 * API DATA CONTRACTS (Capa de Red - Tipado)
 * * Este archivo define la estructura exacta de los objetos provenientes de la API DummyJSON.
 * * Importancia para el perfil Senior:
 * 1. Validación en Tiempo de Compilación: Garantiza que el 'SyncService' mapee 
 * correctamente las propiedades (ej: 'todo' vs 'title').
 * 2. Documentación del Esquema Externo: Actúa como referencia técnica de la respuesta 
 * de red sin necesidad de consultar documentación externa.
 * 3. Prevención de Errores: Evita el uso de 'any', reduciendo bugs relacionados 
 * con propiedades indefinidas durante la hidratación de la base de datos local.
 */

/**
 * Representa la entidad individual de tarea según el esquema de DummyJSON.
 * Se utiliza para tipar las operaciones de filtrado y creación en WatermelonDB.
 */
export interface TodoFromApi {
    id: number;
    /** Título de la tarea. Mapeado directamente a la columna 'todo' de SQLite. */
    todo: string;
    /** Estado booleano. Crucial para el filtrado inicial en el Dashboard. */
    completed: boolean;
    /** ID del propietario, útil para futuras expansiones de multi-usuario. */
    userId: number;
}

/**
 * Estructura de respuesta de la API para endpoints de listado.
 * Define los metadatos de paginación proporcionados por el servidor.
 */
export interface TodoResponse {
    /** Colección de tareas capturadas (Objetivo: 150 registros mediante limit=0). */
    todos: TodoFromApi[];
    /** Total de registros existentes en el servidor. */
    total: number;
    /** Cantidad de registros omitidos (Paginación). */
    skip: number;
    /** Límite de registros solicitados en el payload actual. */
    limit: number;
}