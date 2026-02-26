/**
 * AVATAR VIEW MANAGER (Capa de Puente Nativo - Android)
 * * Este manager actúa como el controlador que expone el componente nativo TextView 
 * a la capa de React Native bajo el nombre "AvatarView".
 * * Implementación Senior:
 * 1. SimpleViewManager: Proporciona la infraestructura base para gestionar una vista simple.
 * 2. Propiedad Reactiva (@ReactProp): Permite que el cambio del nombre en el estado de JS
 * (Zustand) dispare automáticamente una actualización del renderizado nativo.
 * 3. Procesamiento en el Lado Nativo: La lógica de iniciales y color se ejecuta fuera del
 * hilo de JavaScript, garantizando una UI fluida (60 FPS).
 */

package com.taskdashboard

import android.graphics.Color
import android.view.Gravity
import android.widget.TextView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import android.graphics.drawable.GradientDrawable

class AvatarViewManager : SimpleViewManager<TextView>() {
    
    /**
     * Identificador único del componente.
     * Debe coincidir exactamente con el string usado en 'requireNativeComponent' en JS.
     */
    override fun getName(): String {
        return "AvatarView"
    }

    /**
     * Instanciación de la Vista:
     * Define cómo se crea el objeto nativo inicial. Se configura el estilo base
     * (alineación y tipografía) antes de recibir propiedades.
     */
    override fun createViewInstance(reactContext: ThemedReactContext): TextView {
        return TextView(reactContext).apply {
            gravity = Gravity.CENTER
            setTextColor(Color.WHITE)
            textSize = 20f
        }
    }

    /**
     * Propiedad "name":
     * Se invoca cada vez que la prop 'name' cambia en React.
     * Implementa lógica robusta para:
     * i. Generar iniciales (ej: "Juan Perez" -> "JP").
     * ii. Calcular un color determinista basado en el hash del nombre.
     */
    @ReactProp(name = "name")
    fun setName(view: TextView, name: String?) {
        // Extracción de iniciales con manejo de nulos y strings vacíos
        val initials = name?.split(" ")
            ?.filter { it.isNotEmpty() }
            ?.mapNotNull { it.firstOrNull() }
            ?.joinToString("") ?: "?"
        
        view.text = initials.uppercase()

        // Generación de color mediante manipulación de bits (Bitwise) sobre el hash del nombre
        val color = if (!name.isNullOrEmpty()) {
            val hash = name.hashCode()
            // Se extraen componentes RGB del entero del hash
            Color.rgb((hash shr 16) and 0xFF, (hash shr 8) and 0xFF, hash and 0xFF)
        } else {
            Color.GRAY
        }
        
        // Aplicación del fondo circular (OVAL) dinámico
        val shape = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(color)
        }
        view.background = shape
    }
}