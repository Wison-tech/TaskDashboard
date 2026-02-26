/**
 * CUSTOM HOOK: useFilter (Capa de UI State)
 * * Este hook especializado gestiona el estado local de los filtros del Dashboard.
 * * Objetivos de esta implementación:
 * 1. Desacoplamiento: Separa la lógica de navegación/filtrado de los componentes visuales.
 * 2. Tipado Estricto: Utiliza 'FilterType' para asegurar que el estado de la aplicación
 * solo pueda transicionar entre valores válidos ('all', 'pending', 'completed').
 * 3. Mantenibilidad: Facilita la adición de nuevos criterios de filtrado sin modificar
 * la lógica principal del Dashboard.
 */

import { useState } from "react";

/** * Definición exhaustiva de los estados de filtrado permitidos por la lógica de negocio.
 */
export type FilterType = 'all' | 'pending' | 'completed';

export const useFilter = () => {
    /**
     * Estado reactivo del filtro. 
     * Por defecto se inicializa en 'all' para mostrar la totalidad de las tareas
     * sincronizadas al cargar la aplicación.
     */
    const [filter, setFilter] = useState<FilterType>('all');

    /**
     * Función de despacho (Dispatcher) para actualizar el criterio de búsqueda.
     * Centralizar esto aquí permite, en un futuro, añadir efectos secundarios 
     * (como analíticas o persistencia del último filtro usado).
     * * @param newFilter El nuevo estado de filtrado solicitado por el usuario.
     */
    const changeFilter = (newFilter: FilterType) => {
        setFilter(newFilter);
    };

    return {
        filter,
        changeFilter,
    };
};