/**
 * CUSTOM HOOK: useCamera (Capa de Hardware/Servicios)
 * * Este hook encapsula la complejidad de 'react-native-vision-camera' para:
 * 1. Gestión de Dispositivos: Abstrae la selección del hardware (cámara trasera).
 * 2. Ciclo de Vida de Permisos: Maneja la solicitud de acceso al sistema de forma asíncrona.
 * 3. Abstracción: Permite que los componentes de la UI no dependan directamente de la 
 * librería de cámara, facilitando futuros cambios o mocks para testing.
 */

import { useCallback } from "react";
import { Camera, useCameraDevices } from "react-native-vision-camera";

export const useCamera = () => {
    /** * Acceso a los dispositivos físicos disponibles.
     * useCameraDevices es un hook reactivo que detecta cámaras frontales, traseras y externas.
     */
    const devices = useCameraDevices();
    
    /** * Selección estratégica del dispositivo:
     * Para el dashboard de tareas, priorizamos la cámara trasera ('back') 
     * para facilitar la captura de documentos o evidencia física de la tarea.
     */
    const device = devices.find((d) => d.position === 'back');
    
    /** * Gestión Proactiva de Permisos:
     * Implementado con useCallback para evitar re-creaciones innecesarias del método 
     * y optimizar el rendimiento del componente que consuma este hook.
     * * @returns {Promise<boolean>} Indica si el acceso fue concedido por el sistema operativo.
     */
    const requestPermissions = useCallback(async () => {
        const permission = await Camera.requestCameraPermission();
        
        /**
         * NOTA: En producción, aquí se podría implementar una lógica de 
         * 'Linking' para redirigir al usuario a los Ajustes del Sistema si el 
         * permiso fue denegado permanentemente.
         */
        return permission === 'granted';
    }, []);

    return {
        device,
        requestPermissions,
    };
};