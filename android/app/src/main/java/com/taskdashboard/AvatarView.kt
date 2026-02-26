/**
 * AVATAR VIEW (Capa de UI Nativa - Android Custom View)
 * * Implementación de un componente de UI personalizado que extiende AppCompatTextView.
 * * Lógica Senior aplicada:
 * 1. Procesamiento Eficiente: La extracción de iniciales y generación de hash de color
 * se ejecuta en el lado nativo, liberando carga al Bridge de React Native.
 * 2. Determinismo Visual: El uso de hash codes asegura que un mismo nombre siempre 
 * produzca el mismo color, mejorando la consistencia de la UX.
 * 3. Herencia Nativa: Al extender una View nativa, obtenemos optimizaciones de renderizado
 * de texto y accesibilidad del sistema operativo.
 */

package com.taskdashboard

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import androidx.appcompat.widget.AppCompatTextView

class AvatarView(context: Context) : AppCompatTextView(context) {

    init {
        // Configuración estética inicial del círculo
        this.gravity = Gravity.CENTER
        this.setTextColor(Color.WHITE)
        this.textSize = 18f
        this.setTypeface(null, android.graphics.Typeface.BOLD)
        
        // Background circular mediante Drawable programático
        val shape = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(Color.LTGRAY) // Color neutral antes de recibir datos
        }
        this.background = shape
    }

    /**
     * setAvatarName: Punto de entrada para la propiedad 'name' desde JS.
     * Implementa lógica robusta para manejar nombres compuestos.
     */
    fun setAvatarName(name: String) {
        // Lógica Senior: Limpieza de strings y extracción de iniciales (máximo 2)
        val initials = name.split(" ")
            .filter { it.isNotBlank() }
            .take(2)
            .map { it[0].uppercaseChar() }
            .joinToString("")
        
        this.text = initials
        
        // Actualiza el color de fondo dinámicamente basado en la identidad del usuario
        (this.background as? GradientDrawable)?.setColor(generateColor(name))
    }

    /**
     * Algoritmo de Color Consistente:
     * Utiliza el hashCode del nombre para seleccionar un color de una paleta predefinida.
     * Esto garantiza que "Santiago" siempre sea azul, "Elena" siempre sea rosa, etc.
     */
    private fun generateColor(name: String): Int {
        val colors = listOf("#2196F3", "#9C27B0", "#009688", "#FF9800", "#E91E63")
        
        // Math.abs previene índices negativos del hashCode
        val index = Math.abs(name.hashCode()) % colors.size
        return Color.parseColor(colors[index])
    }
}