# RESPUESTAS — TP N° 3: Permisos móviles

Respuestas a las Partes A–F, escritas en el módulo que indica la consigna y usando el código de esta app como ejemplo.

> Nota: no tengo el enunciado literal de cada pregunta, así que cada parte tiene el tema que entendí de la consigna. Si el enunciado del TP numera distinto, hay que reacomodar los títulos y no el contenido.

---

## Parte A · Qué es un permiso

### A1. ¿Qué es un permiso en una app móvil?

Un permiso es una autorización que el sistema operativo (Android o iOS) le da a una app para usar un recurso protegido: cámara, ubicación, micrófono, fotos, notificaciones, contactos, etc. La app no habla directo con el hardware ni con los datos privados. Le pide acceso al sistema, y el sistema decide según lo que la persona contestó.

En esta app, por ejemplo, el escáner de `/reporte/escanear` necesita la cámara. Si la persona no la autoriza, la app no puede abrirla, pero el reporte se puede seguir cargando a mano.

### A2. ¿Para qué existen?

- **Privacidad:** la persona decide qué datos comparte y con quién.
- **Seguridad:** una app maliciosa no puede, por ejemplo, grabar audio en silencio.
- **Transparencia:** el sistema obliga a explicar para qué se usa cada dato (el "texto de propósito").

### A3. ¿Cómo se declaran y cómo se piden?

Hay dos momentos distintos y no hay que confundirlos:

| Momento | Android | iOS | En esta app |
| --- | --- | --- | --- |
| **Declarar** (en la build) | `<uses-permission>` en `AndroidManifest.xml` | Clave `NS...UsageDescription` en `Info.plist` | Lo generan los plugins de `app.json` (`expo-camera`, `expo-location`, …) |
| **Pedir** (en ejecución) | Diálogo del sistema en tiempo de ejecución para los permisos peligrosos (desde Android 6.0, API 23) | Diálogo del sistema la primera vez que se pide | `requestPermissionsAsync()` / `requestForegroundPermissionsAsync()`, siempre después de la pantalla previa |

Si un permiso no está declarado, pedirlo en ejecución no sirve: el sistema lo rechaza de una (o en iOS la app se cierra si falta el texto de propósito).

### A4. ¿Qué tipos de permisos hay?

**Android** distingue, entre otros:

- **De instalación (normales):** se conceden al instalar, sin diálogo. Ejemplo: `INTERNET`.
- **De tiempo de ejecución (peligrosos):** tocan datos o recursos sensibles y requieren un diálogo. Ejemplos: `CAMERA`, `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS` (desde Android 13).
- **Especiales:** se habilitan desde Ajustes, no desde un diálogo. Ejemplo: `SCHEDULE_EXACT_ALARM`.

**iOS** no tiene esa división formal: cada recurso protegido tiene su propio diálogo y su propia clave en `Info.plist`.

### A5. ¿Qué estados puede tener un permiso?

Expo devuelve un `PermissionResponse` con `status` (`granted`, `denied` o `undetermined`), `granted` y `canAskAgain`. En esta app eso se traduce a cuatro estados que la interfaz entiende (`usePermiso`, módulo M36):

| Estado de la app | `granted` | `canAskAgain` | Qué hace la UI |
| --- | --- | --- | --- |
| `cargando` | — (respuesta `null`) | — | Indicador de carga |
| `concedido` | `true` | — | Usa el recurso |
| `preguntable` | `false` | `true` | Pantalla previa con "Continuar" |
| `bloqueado` | `false` | `false` | Explica cómo habilitarlo y ofrece "Abrir Ajustes" |

Además puede haber permisos **parciales**: ubicación aproximada (Android `coarse`, iOS `reduced`) o fotos limitadas (`accessPrivileges: 'limited'`).

### A6. ¿Quién tiene la última palabra?

La persona usuaria, a través del sistema operativo. La app solo puede pedir. Además, la persona puede revocar un permiso en cualquier momento desde Ajustes, por eso la app vuelve a consultar el estado al volver al primer plano (`AppState`, módulo M47) en lugar de guardarlo una sola vez.

### Fuentes

- Android Developers, *Permissions on Android*: https://developer.android.com/guide/topics/permissions/overview (permisos de instalación, de tiempo de ejecución y especiales; los permisos de tiempo de ejecución existen desde Android 6.0, API 23).
- Android Developers, *Notification runtime permission*: https://developer.android.com/develop/ui/views/notifications/notification-permission (`POST_NOTIFICATIONS` desde Android 13, API 33).
- Apple Developer, *Requesting access to protected resources*: https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources
- Expo, *Permissions guide*: https://docs.expo.dev/guides/permissions/
