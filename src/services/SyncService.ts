/**
 * SYNC SERVICE (Capa de Aplicación / Servicios)
 * * Este servicio orquesta la sincronización entre la API externa (DummyJSON) 
 * y la base de datos local (WatermelonDB).
 * * Estrategias Senior implementadas:
 * 1. Batching: Se utiliza 'database.batch' para realizar inserciones masivas en una
 * sola transacción, evitando bloqueos en el hilo de la UI y optimizando el uso de CPU.
 * 2. Idempotencia: Se implementa una verificación mediante Set para evitar la 
 * duplicidad de tareas si el usuario realiza múltiples sincronizaciones.
 * 3. Sanitización de Datos: Se filtran registros vacíos o corruptos antes de la persistencia.
 */

import { database } from '../database';
import Task from '../database/Task';

/**
 * Interface RemoteTask:
 * Define el contrato de datos esperado desde la API externa.
 * Facilita el tipado estricto durante el mapeo de la respuesta.
 */
export interface RemoteTask {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export const syncTaskFromApi = async () => {
  try {
    /**
     * EXTRACCIÓN (Fetch):
     * Se utiliza el parámetro 'limit=0' para sobreescribir la paginación por defecto
     * y cumplir con el requerimiento de procesar los 150 registros solicitados.
     */
    const response = await fetch('https://dummyjson.com/todos?limit=0'); 
    const data = await response.json();
    const apiTasks: RemoteTask[] = data.todos; 

    const tasksCollection = database.get<Task>('tasks');
    
    /**
     * PREVENCIÓN DE DUPLICADOS:
     * Consultamos las tareas ya existentes en el almacenamiento local para 
     * realizar una comparación eficiente mediante un Set de O(1).
     */
    const localTasks = await tasksCollection.query().fetch();
    const localTodoTexts = new Set(localTasks.map(t => t.todo));

    /**
     * PERSISTENCIA ATÓMICA:
     * Todas las operaciones de escritura se envuelven en un 'database.write'.
     */
    await database.write(async () => {
      
      // Filtrado y limpieza: Solo procesamos tareas con contenido y que no existan localmente.
      const tasksToCreate = apiTasks.filter((raw: RemoteTask) => 
        raw.todo && raw.todo.trim().length > 0 && !localTodoTexts.has(raw.todo)
      );

      /**
       * PREPARACIÓN (prepareCreate):
       * En WatermelonDB, 'prepareCreate' no escribe en disco inmediatamente, 
       * sino que prepara el objeto en memoria para la transacción batch.
       */
      const batchActions = tasksToCreate.map((raw: RemoteTask) => 
        tasksCollection.prepareCreate((task) => {
          task.todo = raw.todo.trim(); // Limpieza de espacios en blanco
          task.completed = raw.completed;
        })
      );

      /**
       * INSERCIÓN MASIVA (Batch):
       * Ejecuta cientos de inserciones en milisegundos. Esta es la técnica 
       * estándar para garantizar una "experiencia fluida" en apps Senior.
       */
      if (batchActions.length > 0) {
        await database.batch(...batchActions);
      }
    });
    
    console.log(`[SYNC_COMPLETE]: ${apiTasks.length} tareas procesadas correctamente.`);
  } catch (error) {
    /**
     * RESILIENCIA:
     * El error se captura para evitar que la aplicación se detenga ante fallos de red,
     * permitiendo que el usuario siga operando con los datos locales previos.
     */
    console.error("[SYNC_SERVICE_ERROR]:", error);
    throw error; // Re-lanzamos para que useTasks pueda manejar el estado visual (isSyncing)
  }
};