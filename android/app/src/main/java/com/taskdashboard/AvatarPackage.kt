/**
 * AVATAR PACKAGE (Capa de Registro Nativo - Android)
 * * Este módulo actúa como el puente (Bridge) oficial para registrar componentes
 * nativos en el motor de React Native.
 * * Importancia para el Perfil Senior:
 * 1. Extensibilidad: Implementa la interfaz 'ReactPackage', permitiendo que la 
 * aplicación reconozca el nuevo ViewManager (AvatarViewManager).
 * 2. Inyección de Dependencias: Facilita que el contexto de la aplicación de React 
 * (ReactApplicationContext) reconozca y pueda instanciar la vista personalizada.
 * 3. Optimización: Al no declarar 'NativeModules' innecesarios, se mantiene un 
 * bajo consumo de memoria durante la inicialización del bridge.
 */

package com.taskdashboard

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AvatarPackage : ReactPackage {
    
    /**
     * Registro de Módulos de Función:
     * No se requieren módulos de puente lógicos (métodos invocables desde JS) 
     * para este componente, por lo que devolvemos una lista vacía.
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    /**
     * Registro de Administradores de Vista (ViewManagers):
     * Aquí vinculamos el 'AvatarViewManager'. Esto permite que cuando JS llame a 
     * 'requireNativeComponent("AvatarView")', React Native sepa que debe buscar 
     * la definición en esta clase registrada.
     */
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(AvatarViewManager())
    }
}