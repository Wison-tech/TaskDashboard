/**
 * TASK ITEM COMPONENT (Capa de UI Reactiva)
 * * Este componente representa una unidad de tarea en la lista y demuestra:
 * 1. Reactividad Offline-First: Gracias a 'withObservables', el componente se auto-actualiza 
 * cuando cambian los datos en SQLite sin necesidad de re-renders globales[cite: 30, 41].
 * 2. Bridge con Módulo de Cámara: Implementa el requisito opcional de adjuntar fotos 
 * mediante una integración nativa y guardado local persistente[cite: 54, 55].
 * 3. Feedback Instantáneo: La UI refleja cambios de estado (completed) de forma inmediata[cite: 41].
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { launchCamera } from 'react-native-image-picker';
import Task from '../database/Task';

const TaskItem = ({ task }: { task: Task }) => {
  
  /**
   * Manejador de Cámara Nativa:
   * Abre la interfaz de cámara del sistema y gestiona el flujo de captura de imagen[cite: 61, 62].
   */
  const handleCamera = async () => {
    // Configuración de captura optimizada para balancear calidad y espacio de almacenamiento
    const result = await launchCamera({ 
      mediaType: 'photo', 
      quality: 0.5, 
      saveToPhotos: true 
    });

    // Validación de resultado: Evita crasheos si el usuario cancela la acción 
    if (result.assets && result.assets[0].uri) {
      /**
       * Persistencia Offline-First:
       * Se guarda la referencia URI directamente en la entidad Task de WatermelonDB[cite: 77, 78].
       * La UI se actualizará automáticamente gracias al observador.
       */
      await task.addAttachment(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      {/* Selector de Estado: Implementa la lógica de marcar como completada/pendiente [cite: 32, 40] */}
      <TouchableOpacity 
        activeOpacity={0.7}
        style={[styles.checkbox, task.completed && styles.checkboxActive]} 
        onPress={() => task.toggleComplete()}
      >
        {task.completed && <Text style={styles.checkIcon}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.todoText, task.completed && styles.completedText]}>
          {task.todo ? task.todo : "Tarea sin título en DB"}
        </Text>
        
        {/* Renderizado de Adjunto: Lee la referencia desde la BD local para visualización offline [cite: 80] */}
        {task.attachmentUri && (
          <Image 
            source={{ uri: task.attachmentUri }} 
            style={styles.attachmentImg} 
            accessibilityLabel="Imagen adjunta a la tarea"
          />
        )}
      </View>

      {/* Accionador de Cámara: Punto de entrada para el módulo nativo [cite: 58] */}
      <TouchableOpacity 
        style={styles.cameraBtn} 
        onPress={handleCamera}
        accessibilityRole="button"
        accessibilityLabel="Tomar foto y adjuntar"
      >
        <Text style={{fontSize: 18}}>📸</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * PATRÓN OBSERVER:
 * Transforma el componente en un nodo reactivo. 'task.observe()' asegura que 
 * cualquier cambio en la fila de la base de datos SQLite se propague solo a este item.
 */
const enhance = withObservables(['task'], ({ task }) => ({
  task: task.observe(),
}));

export default enhance(TaskItem);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardCompleted: { 
    backgroundColor: '#F8F9FA', 
    elevation: 0 
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  checkboxActive: { backgroundColor: '#6366F1' },
  checkIcon: { color: '#FFF', fontWeight: 'bold' },
  content: { flex: 1 },
  todoText: { fontSize: 16, color: '#1E293B', fontWeight: '600' },
  completedText: { 
    textDecorationLine: 'line-through', 
    color: '#94A3B8' 
  },
  attachmentImg: { 
    width: '100%', 
    height: 120, 
    borderRadius: 14, 
    marginTop: 10 
  },
  cameraBtn: { 
    backgroundColor: '#F1F5F9', 
    padding: 10, 
    borderRadius: 14 
  }
});