# Bitácora — Mantenimiento IPF

Material de estudio para la defensa oral. Cada módulo tiene tres partes: **Qué hice**, **Por qué** y **Qué podría preguntar el docente**.

---

## M01 · Creé el proyecto con create-expo-app en Expo SDK 57

**Qué hice**

- Creé el proyecto con `npx create-expo-app@latest --template default@sdk-57`.
- Verifiqué en `package.json` que `expo` quedó en `~57.0.x`, con React Native 0.86 y React 19.2.
- La plantilla ya trae TypeScript y Expo Router, con las rutas en `src/app`.

**Por qué**

- La consigna exige SDK 57. Hoy `create-expo-app@latest` crea SDK 58 por defecto, así que fijé la plantilla con `@sdk-57` en lugar de bajar la versión a mano después (eso deja dependencias desalineadas).
- Expo Go solo abre proyectos del SDK que soporta, así que fijar la versión también define con qué Expo Go se prueba.

**Qué podría preguntar el docente**

- *¿Cómo sabés que estás en SDK 57?* — Por la dependencia `"expo": "~57.0.x"` en `package.json`. El número mayor de `expo` es el número de SDK.
- *¿Por qué no usaste `@latest` a secas?* — Porque `@latest` del template apunta al SDK más nuevo (58). El CLI `create-expo-app@latest` es solo el instalador; la versión del SDK la define el template.
- *¿Qué significa el `~` en `~57.0.31`?* — Que npm acepta parches (`57.0.x`) pero no versiones menores nuevas. Expo usa `~` para que todos los módulos queden alineados con el SDK.
