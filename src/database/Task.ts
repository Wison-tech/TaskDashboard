/**
 * TASK MODEL (Capa de Dominio)
 * * Esta clase representa la entidad 'Task' y encapsula toda su lógica de negocio.
 * * En la arquitectura Offline-First, el modelo es el encargado de interactuar 
 * directamente con la base de datos local para garantizar que los cambios 
 * sean persistentes y reactivos.
 */

import { Model } from "@nozbe/watermelondb";
import { field, text, writer } from '@nozbe/watermelondb/decorators';

export default class Task extends Model {
  // Define la correspondencia con la tabla física en SQLite
  static table = 'tasks';

  /** * @text: Decorador para campos de texto simple. 
   * Mapea la propiedad 'todo' proveniente de la API externa (DummyJSON).
   */
  @text('todo') todo!: string;

  /** * @field: Decorador para tipos de datos primitivos (boolean, number). 
   */
  @field('completed') completed!: boolean;

  /** * Almacena la ruta local (URI) de la imagen capturada por la cámara.
   * Este campo permite que las fotos sean visibles incluso sin conexión a internet.
   */
  @text('attachment_uri') attachmentUri?: string;

  /**
   * ACCIÓN DE NEGOCIO: Toggle Complete
   * * @writer: Decorador obligatorio para cualquier operación que modifique la BD.
   * Cambia de forma atómica el estado de la tarea (Pendiente <-> Hecha).
   * Al ser una operación en el modelo, WatermelonDB notificará automáticamente
   * a todos los componentes que estén observando esta tarea (Requisito de fluidez).
   */
  @writer async toggleComplete() {
    await this.update((task) => {
      task.completed = !task.completed; 
    });
  }

  /**
   * ACCIÓN DE NEGOCIO: Add Attachment
   * * Vincula una imagen externa (capturada por el módulo nativo de cámara) 
   * a la tarea actual de forma persistente.
   * @param uri Ruta de la imagen proporcionada por el Image Picker.
   */
  @writer async addAttachment(uri: string) {
    await this.update((task) => {
      task.attachmentUri = uri; 
    });
  }
}