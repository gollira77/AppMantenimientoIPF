# Mantenimiento IPF

App para que alumnos y docentes del **Instituto Politécnico Formosa** reporten desperfectos del edificio (electricidad, agua, mobiliario, equipos) y reciban un aviso cuando se resuelven.

Trabajo Práctico N° 3 del **Taller de React Native II**. El tema central son los **permisos móviles** en Android, iOS y Expo: pedir solo lo necesario, en el momento justo, explicando para qué, y que la app siga funcionando si la persona dice que no.

## Stack

- Expo **SDK 57** con TypeScript y Expo Router
- Módulos de Expo: `expo-camera`, `expo-location`, `expo-image-picker`, `expo-notifications`
- Calidad: TypeScript `strict`, ESLint + Prettier, Jest (`jest-expo` + Testing Library), Husky + commitlint, GitHub Actions

## Cómo correrlo

```bash
npm install
npx expo start
```

Escaneá el QR con **Expo Go** (Android) o con la app de Cámara (iOS). Expo Go tiene que ser compatible con el SDK 57.

## Estructura

```
src/
  app/          rutas (Expo Router)
  components/   componentes de UI
  hooks/        hooks de React
  lib/          lógica pura y servicios, sin React
docs/
  bitacora.md   qué hice, por qué y preguntas de la defensa, módulo por módulo
RESPUESTAS.md   respuestas a las Partes A–F del TP
```

## Flujo de trabajo con Git

- Todo el desarrollo se hace en la rama **`develop`**.
- **Un módulo = un commit**, con mensajes en formato Conventional Commits, en primera persona y en pasado: `feat(camara): mostré la cámara en /reporte/escanear`.
- `main` solo recibe el merge final con el tag `v1.0.0`.

> Este README se completa en el módulo M76 con el árbol final, los plugins, la tabla de permisos y las capturas.
