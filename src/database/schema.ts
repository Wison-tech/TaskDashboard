/**
 * DATABASE SCHEMA (Capa de Persistencia - Estructura)
 * * Define la estructura física de las tablas en SQLite a través de WatermelonDB.
 * * Este esquema es la "Única Fuente de Verdad" para la estructura de datos local
 * y es fundamental para garantizar que la persistencia sea predecible y performante.
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  /**
   * Versión del esquema: Fundamental para la gestión de migraciones futuras.
   * Al incrementar este número, WatermelonDB detecta cambios y ejecuta 
   * las funciones de migración necesarias para no perder datos del usuario.
   */
  version: 1,

  tables: [
    /**
     * Tabla 'tasks': Almacena tanto los datos sincronizados de la API (DummyJSON)
     * como los datos generados localmente (adjuntos de cámara).
     */
    tableSchema({
      name: 'tasks',
      columns: [
        /**
         * 'todo': El título o descripción de la tarea. 
         * Se mapea desde la propiedad 'todo' del JSON de la API.
         */
        { name: 'todo', type: 'string' },

        /**
         * 'completed': Estado booleano de la tarea.
         * Su persistencia local permite cambios instantáneos en la UI sin latencia de red.
         */
        { name: 'completed', type: 'boolean' },

        /**
         * 'attachment_uri': Almacena la ruta local de la imagen capturada con la cámara.
         * Se marca como 'isOptional: true' porque no todas las tareas requieren foto,
         * cumpliendo con el requisito de adjuntos de la KATA.
         */
        { name: 'attachment_uri', type: 'string', isOptional: true },
      ],
    }),
  ],
});