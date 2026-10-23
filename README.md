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

## Permisos bloqueados en Android (`blockedPermissions`)

`app.json` bloquea con `android.blockedPermissions` los permisos que la app **no usa**. Expo los agrega al manifiesto con `tools:node="remove"`, así ninguna librería los puede sumar al fusionar los manifiestos. Lo verifica el test `src/__tests__/permisosNativos.test.ts` con `expo config --type introspect`, y también se puede ver con `npm run permisos:nativos`.

| Permiso bloqueado | Quién lo agregaría | Por qué no lo necesito |
| --- | --- | --- |
| `SYSTEM_ALERT_WINDOW` | Expo, por defecto | Sirve para dibujar sobre otras apps. La app nunca muestra ventanas flotantes. |
| `READ_EXTERNAL_STORAGE` | `expo-image-picker` y `expo-file-system` (hasta API 32) | Las fotos se eligen con el selector del sistema, que no necesita permiso, y la app solo guarda archivos en su carpeta privada. |
| `WRITE_EXTERNAL_STORAGE` | `expo-image-picker` y `expo-file-system` (hasta API 32) | La app no escribe en el almacenamiento compartido. La cámara del sistema guarda la foto en el caché de la app. |
| `READ_MEDIA_IMAGES` | Ninguna hoy (lo bloqueo por las dudas) | La consigna pide no declararlo: la foto sale del selector del sistema. Además, Google Play lo restringe a apps cuya función principal es la galería. |
| `READ_MEDIA_VIDEO` | Ninguna hoy | La app no trabaja con videos. |
| `READ_MEDIA_AUDIO` | Ninguna hoy | La app no lee archivos de audio. |
| `READ_MEDIA_VISUAL_USER_SELECTED` | Ninguna hoy | Es el acceso parcial a fotos de Android 14. Con el selector del sistema no hace falta. |
| `ACCESS_BACKGROUND_LOCATION` | `expo-location` si se activa el segundo plano | La ubicación se usa solo con la app abierta, al reportar. Google Play exige una justificación especial para pedirlo. |
| `RECORD_AUDIO` | `expo-camera` y `expo-image-picker` (para grabar video) | La app no graba audio ni video. Se habilita recién en M73 para la nota de voz. |

Permisos que **sí** quedan: `INTERNET` (instalación), `VIBRATE` (instalación, para las notificaciones), `CAMERA` (escáner y foto) y `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` (ubicación en primer plano).
