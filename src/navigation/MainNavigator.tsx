/**
 * MAIN NAVIGATOR (Capa de Navegación)
 * * Se utiliza '@react-navigation/native-stack' para garantizar un rendimiento superior.
 * A diferencia del stack estándar, Native Stack utiliza las primitivas de navegación 
 * nativas de iOS (UINavigationController) y Android (Fragment), optimizando el uso de memoria.
 * * * Responsabilidades Senior:
 * 1. Gestión de Jerarquías: Define el árbol de navegación principal de la aplicación.
 * 2. Rendimiento Nativo: Delega las transiciones y gestos al hilo nativo del sistema operativo.
 * 3. Tipado de Rutas: Utiliza 'RootStackParamList' para garantizar que la navegación entre 
 * pantallas sea segura (Type-safe), evitando errores de parámetros inexistentes.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { DashboardScreen } from '../screens/DashboardScreen';

// Stack Navigator tipado: Previene errores de navegación en tiempo de compilación.
const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                /**
                 * Deshabilitamos el Header por defecto para permitir que el 'Dashboard'
                 * implemente su propio encabezado personalizado con el Bridge Nativo (AvatarView).
                 */
                headerShown: false, 
                // Animaciones nativas fluidas que mejoran la experiencia de usuario (UX).
                animation: 'slide_from_right'
            }}
        >
            {/* Pantalla Principal: Dashboard de Tareas */}
            <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen} 
            />
            
            {/** * NOTA SENIOR: El escalamiento a pantallas adicionales (ej: CameraScreen)
             * se mantiene preparado para facilitar el crecimiento del Scaffolding modular.
             */}
            {/* <Stack.Screen name="Camera" component={CameraScreen} /> */}
        </Stack.Navigator>
    );
};