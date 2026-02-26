/**
 * DATABASE INITIALIZATION (Capa de Persistencia)
 * * Este archivo configura el motor de persistencia centralizado, implementando 
 * el patrón 'Adapter' para conectar WatermelonDB con SQLite.
 * * Aspectos clave para la arquitectura Offline-First:
 * 1. Abstracción de Datos: Se utiliza un adaptador de SQLite para el almacenamiento físico.
 * 2. Rendimiento (JSI): Se habilita JavaScript Interface para una sincronización 
 * ultra-rápida, eliminando el cuello de botella del bridge tradicional en inserciones masivas.
 * 3. Integridad: Se vincula el esquema de la aplicación con los modelos de dominio.
 */

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema"; // Definición de tablas, columnas e índices
import Task from "./Task";     // Modelo de dominio para la entidad Tarea

/**
 * Configuración del Adaptador SQLite:
 * Gestiona la comunicación de bajo nivel y las migraciones del esquema.
 */
const adapter = new SQLiteAdapter({
    schema, 
    // JSI (JavaScript Interface): Mejora el rendimiento hasta 10x en operaciones batch
    // fundamentales para procesar los 150 registros iniciales sin lag en la UI.
    jsi: true, 
    onSetUpError: error => {
        /**
         * Manejo crítico de errores: Si la base de datos falla al iniciar,
         * la aplicación no podrá cumplir con el requisito offline-first.
         */
        console.error("Error crítico al configurar la base de datos local:", error);
    }
});

/**
 * Instancia Global de la Base de Datos (Singleton):
 * Orquesta los modelos y proporciona la API reactiva para consultas y escrituras.
 * Se exporta para ser inyectada a través del DatabaseProvider en App.tsx.
 */
export const database = new Database({
    adapter,
    modelClasses: [Task], // Registro de modelos de dominio
});