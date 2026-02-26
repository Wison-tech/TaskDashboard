/**
 * FILTER TABS COMPONENT (Capa de UI)
 * * Este componente gestiona la navegación segmentada para el filtrado de tareas.
 * Cumple con el requerimiento funcional de implementar filtros para ver: 
 * "Todas", "Completadas" y "Pendientes".
 * * Principios aplicados:
 * 1. Declaratividad: Se utiliza un array de configuración para renderizar las opciones,
 * facilitando la extensión futura de nuevos estados de filtrado.
 * 2. Feedback Visual Inmediato: Implementa cambios de estilo condicionales para 
 * reflejar instantáneamente la interacción del usuario.
 * 3. Tipado Estricto: Uso de 'FilterType' para evitar estados inconsistentes en la UI.
 */

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Unión de tipos para restringir los estados de filtrado permitidos.
 */
type FilterType = 'all' | 'pending' | 'completed';

interface FilterTabsProps {
  /** Filtro seleccionado actualmente en el estado global (Zustand) o local. */
  currentFilter: FilterType;
  /** Callback para notificar al componente padre sobre el cambio de intención del usuario. */
  onFilterChange: (filter: FilterType) => void;
}

export const FilterTabs = ({ currentFilter, onFilterChange }: FilterTabsProps) => {
  /**
   * Configuración de los botones de filtro.
   * Centralizar estas etiquetas facilita la internacionalización (i18n) en el futuro.
   */
  const filters: { label: string; value: FilterType }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Hechas', value: 'completed' },
  ];

  return (
    <View style={styles.container}>
      {filters.map((f) => (
        <TouchableOpacity
          key={f.value}
          // Composición de estilos condicionales para resaltar la pestaña activa
          style={[
            styles.tab, 
            currentFilter === f.value && styles.activeTab
          ]}
          onPress={() => onFilterChange(f.value)}
          // Accesibilidad: Indica al lector de pantalla qué pestaña está seleccionada
          accessibilityRole="tab"
          accessibilityState={{ selected: currentFilter === f.value }}
        >
          <Text style={[
            styles.text, 
            currentFilter === f.value && styles.activeText
          ]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * Estilos optimizados para una experiencia táctil fluida (Haptic friendly).
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    // Sutil elevación para mejorar la jerarquía visual
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12, // Ajustado para un mejor balance visual
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007aff', // Color primario para énfasis
  },
  text: {
    color: '#666',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  }
});