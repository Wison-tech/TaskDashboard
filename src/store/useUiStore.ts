/**
 * UI STATE STORE (Capa de Aplicación - Zustand)
 * * Este store gestiona el estado global efímero de la aplicación que no requiere 
 * persistencia en la base de datos relacional (SQLite).
 * * Decisiones de Arquitectura Senior:
 * 1. Separación de Preocupaciones (SoC): Mientras WatermelonDB maneja el dominio (Tareas),
 * Zustand maneja la sesión del usuario y el estado de conectividad.
 * 2. Rendimiento: Al ser un store atómico, evita re-renders innecesarios en componentes 
 * que no consumen estas propiedades específicas.
 * 3. Escalabilidad: Cumple con el requisito de la KATA de implementar un manejo de 
 * estado moderno y ligero con menos boilerplate que Redux.
 */

import { create } from 'zustand';

/**
 * Interface UiState:
 * Define la estructura del estado global de la interfaz.
 * Incluye tipado estricto para las acciones y propiedades.
 */
interface UiState {
    /** Nombre del usuario para ser procesado por el Bridge Nativo (AvatarView) */
    userName: string;
    /** Estado de red detectado para lógica de resiliencia */
    isOnline: boolean;
    /** Acción para actualizar la identidad del usuario en tiempo real */
    setUserName: (name: string) => void;
    /** Acción para alternar visualmente el comportamiento Online/Offline */
    setOnlineStatus: (status: boolean) => void;
}

/**
 * useUiStore:
 * Hook personalizado que expone el estado global mediante el patrón Selector.
 */
export const useUiStore = create<UiState>((set) => ({
  // Estado inicial: Empezamos vacío para disparar el flujo de identificación en el Dashboard
  userName: '', 
  isOnline: true,

  /**
   * Actualiza el nombre del usuario.
   * Al cambiar este valor, el AvatarView (Componente Nativo) se actualizará 
   * automáticamente gracias a la reactividad de Zustand.
   */
  setUserName: (name) => set({ userName: name }),

  /**
   * Permite que la aplicación reaccione visualmente a cambios de conectividad,
   * un pilar fundamental en el enfoque Offline-First.
   */
  setOnlineStatus: (status) => set({ isOnline: status }),
}));