/**
 * AVATAR VIEW BRIDGE (Capa de Integración Nativa)
 * * Este componente actúa como un "Wrapper" de alto nivel sobre la implementación nativa
 * requerida por la KATA (Requisito Senior Avanzado).
 * * Objetivos de esta implementación:
 * 1. Abstracción: Ocultar la complejidad del Native Bridge tras un componente React estándar.
 * 2. Rendimiento: Delegar el renderizado de iniciales y el cálculo de hash de color a 
 * hilos nativos (Kotlin/Swift) para optimizar el main thread de JS.
 * 3. Tipado Estricto: Garantizar que la propiedad 'name' sea obligatoria mediante TypeScript.
 */

import { requireNativeComponent, ViewProps, StyleSheet } from "react-native";

/**
 * Interfaz de propiedades para el componente nativo.
 * Extiende ViewProps para permitir estilos estándar de React Native (margin, flex, etc.).
 */
interface AvatarViewProps extends ViewProps {
  /**
   * Nombre completo del usuario utilizado por la lógica nativa para:
   * i. Extraer iniciales (ej: "Santiago Lopez" -> "SL").
   * ii. Generar un color de fondo único basado en el hash del nombre.
   */
  name: string; 
}

/**
 * Vinculación con el código nativo:
 * El identificador 'AvatarView' debe coincidir exactamente con:
 * - Android: getName() dentro del ViewManager escrito en Kotlin.
 * - iOS: RCT_EXPORT_MODULE() en la implementación de Swift/Obj-C.
 */
const NativeAvatar = requireNativeComponent<AvatarViewProps>('AvatarView');

export const AvatarView = ({ name, style }: AvatarViewProps) => {
  return (
    <NativeAvatar 
      name={name} 
      // Se combinan estilos por defecto con estilos externos para mayor flexibilidad
      style={[styles.defaultStyle, style]} 
    />
  );
};

/**
 * Estilos base para el componente.
 * Se define un tamaño por defecto y bordes redondeados para asegurar la 
 * visualización circular requerida.
 */
const styles = StyleSheet.create({
  defaultStyle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Asegura la forma circular en el árbol de vistas de RN
    overflow: 'hidden',
  },
});