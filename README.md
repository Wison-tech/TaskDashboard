# TaskDashboard - Agile Mobile KATA

Este proyecto es una aplicación de gestión de tareas de alto rendimiento desarrollada con **React Native**, diseñada bajo una arquitectura **Offline-First**. La aplicación garantiza una experiencia de usuario fluida mediante la sincronización masiva de datos y el uso de componentes nativos personalizados.

---

## 📱 Vista Previa

> Reemplaza las rutas debajo con tus propias capturas (ejemplo: `./assets/dashboard.png`)

| Dashboard & Filtros | Avatar Nativo | Adjuntos (Cámara) |
|---|---|---|
| ![Dashboard](./assets/dashboard.png) | ![Avatar](./assets/avatar-native.png) | ![Camera](./assets/camera-module.png) |

---

## 🚀 Decisiones de Arquitectura

### 1. Persistencia: WatermelonDB

Se seleccionó **WatermelonDB** sobre otras soluciones (como AsyncStorage o SQLite puro) por su capacidad de manejo de datos a gran escala:

- **Arquitectura Offline-First**: La aplicación lee y escribe exclusivamente en la base de datos local, asegurando funcionalidad total sin conexión.
- **Reactividad**: Utiliza observables para actualizar la interfaz de usuario automáticamente ante cambios en la base de datos local.
- **Inserción Masiva (Batching)**: Permite procesar los 150 registros requeridos de forma asíncrona en una sola transacción, optimizando el rendimiento del hilo principal.

---

### 2. Sincronización Masiva

La lógica implementada en `src/services/SyncService.ts` consume la API de **DummyJSON** utilizando el parámetro `limit=0`. Esto permite omitir la paginación por defecto y obtener la totalidad de los 150 registros necesarios para cumplir con los criterios de evaluación.

---

### 3. Native Bridge: AvatarView

El componente nativo `src/components/AvatarView.tsx` se conecta mediante un Bridge para garantizar rendimiento y fidelidad visual:

- **Android (Kotlin)**: Vista personalizada que genera iniciales y colores de fondo basados en un hash del nombre del usuario.
- **iOS (Swift)**: Implementación nativa equivalente para asegurar paridad funcional en ambas plataformas.

---

## 🛠️ Resiliencia y Casos de Borde

Para garantizar una experiencia de nivel Senior, se implementaron las siguientes consideraciones de producción:

- **Manejo de Permisos**: Gestión proactiva de permisos de cámara en Android/iOS desde `useCamera.ts`.
- **Persistencia de Fotos**: Las imágenes se almacenan localmente y se vinculan a la entidad `Task` en WatermelonDB.
- **Pull-to-Refresh**: Sincronización manual que realiza merge inteligente evitando duplicación de registros.
- **Validación de Datos Externos**: Limpieza de strings (`trim()`), validación estricta de tipos y normalización antes de persistencia.
- **Control de Estados Vacíos**: Manejo visual para estados sin tareas o sin resultados filtrados.

---

## 🛠️ Stack Tecnológico

- **Framework**: React Native 0.84+
- **Lenguaje**: TypeScript (Tipado Estricto)
- **Estado Global**: Zustand (`src/store/useUiStore.ts`)
- **Persistencia**: WatermelonDB + SQLite
- **Pruebas**: Jest + React Native Testing Library

---

## 📂 Estructura del Proyecto (Scaffolding)

```text
src/
 ├── api/
 │    ├── client.ts
 │    └── taskApi.ts
 │
 ├── components/
 │    ├── AvatarView.tsx
 │    ├── filterTabs.tsx
 │    └── TaskItem.tsx
 │
 ├── database/
 │    ├── index.ts
 │    ├── schema.ts
 │    └── Task.ts
 │
 ├── hooks/
 │    ├── useCamera.ts
 │    ├── useFilter.ts
 │    └── useTasks.ts
 │
 ├── navigation/
 │    └── MainNavigator.tsx
 │
 ├── screens/
 │    └── DashboardScreen.tsx
 │
 ├── services/
 │    ├── SyncService.ts
 │    └── __tests__/
 │
 ├── store/
 │    └── useUiStore.ts
 │
 ├── types/
 │    └── api.ts
 │
 └── types.ts
```

---

## 🤖 Uso de Inteligencia Artificial

En cumplimiento con los lineamientos de la KATA, se documenta el uso de IA como herramienta estratégica de apoyo durante el ciclo de desarrollo:

**Herramientas utilizadas**: ChatGPT-4 / Gemini 1.5 Pro  

### Contribuciones principales

- Resolución de conflictos de `peerDependencies` entre React 19 y WatermelonDB.
- Generación de mocks para pruebas unitarias del motor de base de datos.
- Optimización de lógica de batch insert para los 150 registros iniciales.

### Supervisión Humana

- Corrección manual de errores `TS2307`.
- Validación de integridad de datos provenientes de DummyJSON.
- Ajuste explícito del parámetro `limit=0`.

---

## 🧪 Pruebas Unitarias

La suite de pruebas cubre:

- Cambio de estado (`toggleComplete`) en el modelo `Task`.
- Transformación y limpieza de datos de la API.
- Persistencia correcta de URIs de imágenes.

### Ejecutar los tests

```bash
npm test
```

---

## ⌨️ Scripts Disponibles

- `npm start` → Inicia Metro Bundler.
- `npm test` → Ejecuta la suite completa de pruebas.
- `npm run lint` → Verifica estilo y tipado.
- `npx react-native run-android` → Ejecuta en Android.
- `npx react-native run-ios` → Ejecuta en iOS.

---

## ✅ Checklist de Requerimientos

- [x] Arquitectura Offline-First con WatermelonDB.
- [x] Sincronización completa de 150 tareas.
- [x] Componente Nativo `AvatarView` en Android e iOS.
- [x] Módulo de Cámara con persistencia local.
- [x] Testing de lógica crítica.
- [x] Uso documentado de IA.
- [x] TypeScript en modo estricto.
- [x] Inserción masiva optimizada (batch).

---

## ⚙️ Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd TaskDashboard
```

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 3. Configuración Nativa

#### iOS

```bash
cd ios
pod install
cd ..
```

#### Android

Asegurarse de tener configurado:

- Android SDK  
- JDK 17  

---

### 4. Ejecutar la aplicación

#### Android

```bash
npx react-native run-android
```

#### iOS

```bash
npx react-native run-ios
```



Desarrollado como parte de la **Agile Mobile KATA - Nivel Senior**.