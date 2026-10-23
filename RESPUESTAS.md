# RESPUESTAS — TP N° 3: Permisos móviles

Respuestas a las Partes A–F. El enunciado completo está en [`docs/consignas.md`](docs/consignas.md). Cada parte se escribe en el módulo que indica la consigna y usa el código de esta app (Mantenimiento IPF) como ejemplo.

---

## Parte A · ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**

Un permiso es una autorización que el sistema operativo le da a una app para usar un recurso protegido: la cámara, la ubicación, el micrófono, las fotos, los contactos o mostrar notificaciones. Sin esa autorización, la app no puede llegar a ese recurso.

- **La app** declara qué recursos puede llegar a usar y, en el momento en que los necesita, los pide. Solo puede pedir, nunca tomar.
- **El sistema operativo** es el intermediario: muestra el diálogo (que la app no puede modificar), guarda la decisión y la hace cumplir. Si la persona dijo que no, el sistema bloquea el acceso aunque la app insista.
- **La persona usuaria** decide. Puede aceptar, rechazar, aceptar parcialmente (ubicación aproximada, algunas fotos) y cambiar de opinión cuando quiera desde Ajustes.

En esta app: para leer el QR del aula en `/reporte/escanear` la app pide la cámara, el sistema muestra su diálogo y la persona decide. Si dice que no, el código del aula se escribe a mano.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**

La sandbox es el aislamiento que el sistema le impone a cada app: cada una corre en su propio espacio (en Android, con su propio usuario de Linux; en iOS, en su propio contenedor) y no puede leer los archivos de otras apps ni tocar el hardware o los datos personales directamente. Los permisos son las "puertas" controladas que el sistema abre en esa caja: cada permiso concedido habilita un recurso puntual de afuera.

Sin ningún permiso de tiempo de ejecución, una app igual puede:

- dibujar su interfaz y responder a toques;
- guardar y leer sus propios datos (AsyncStorage, archivos en su carpeta privada);
- usar internet (en Android, `INTERNET` es un permiso de instalación que se concede solo);
- usar los **selectores del sistema**, como el selector de fotos: la persona elige una foto y el sistema se la entrega a la app, sin darle acceso a la galería. Esta app lo usa en `/reporte/foto` con `launchImageLibraryAsync`;
- abrir otras apps o Ajustes con `Linking`.

**c) Las cuatro razones por las que existen los permisos, con un ejemplo de cada una**

| Razón | Ejemplo concreto |
| --- | --- |
| **Privacidad**: los datos personales son de la persona, no de la app. | Una linterna no tiene por qué leer la ubicación ni los contactos. |
| **Seguridad**: evitar que una app maliciosa o con un error haga daño. | Sin el permiso de micrófono, una app no puede grabar conversaciones en silencio. |
| **Transparencia** (consentimiento informado): la persona sabe qué se usa y para qué. | El texto de propósito: "Usamos tu cámara para leer el código QR del aula". |
| **Control**: la persona puede limitar o revocar el acceso en cualquier momento. | Pasar la ubicación a "aproximada" o quitarle la cámara a una app desde Ajustes. |

**d) La analogía del portero**

- **La visita** es la app: quiere entrar a un departamento (un recurso, por ejemplo la cámara).
- **El portero** es el sistema operativo: no deja pasar a nadie sin consultar, y es él quien toca el portero eléctrico (el diálogo), no la visita.
- **El dueño del departamento** es la persona usuaria: es quien decide si la visita sube o no.

"El portero se acuerda de la respuesta" significa que el sistema **guarda la decisión**. Si el dueño dijo "sí", la próxima vez el portero deja pasar sin volver a llamar. Si dijo "no" (y en Android, si lo dijo dos veces), el portero ni siquiera llama: le contesta a la visita "no" directamente. Por eso, cuando un permiso queda bloqueado, llamar otra vez a `request…()` no muestra ningún diálogo, y la única salida es que el dueño cambie la indicación desde Ajustes.

### A2. Declarar y solicitar

| | Declarar (al compilar) | Solicitar (al ejecutar) |
| --- | --- | --- |
| **¿Qué se hace?** | Se avisa al sistema, dentro del binario de la app, qué recursos protegidos puede llegar a usar y (en iOS) para qué. | Se pide a la persona, en el momento en que la función lo necesita, que autorice el recurso. El sistema muestra su diálogo. |
| **¿Dónde / cómo en Android?** | `<uses-permission android:name="android.permission.CAMERA" />` en `AndroidManifest.xml`. | Diálogo de tiempo de ejecución (`ActivityCompat.requestPermissions`), solo para permisos peligrosos desde Android 6.0. Los de instalación no se piden. |
| **¿Dónde / cómo en iOS?** | Clave de texto de propósito en `Info.plist`, por ejemplo `NSCameraUsageDescription` con el texto que se va a mostrar. | La primera vez que la app llama a la API del recurso (o a su función de pedido, como `AVCaptureDevice.requestAccess`), iOS muestra el diálogo con ese texto. |
| **¿Dónde / cómo en Expo?** | En `app.json`: los **plugins** de cada módulo (`expo-camera`, `expo-location`…) agregan los permisos y textos; `android.permissions`, `android.blockedPermissions` e `ios.infoPlist` ajustan el resto. `npx expo prebuild` o EAS Build generan el manifiesto y el `Info.plist`. | Con las funciones de cada módulo: `requestCameraPermissionsAsync()`, `Location.requestForegroundPermissionsAsync()`, `Notifications.requestPermissionsAsync()`, o los hooks como `useCameraPermissions()`. |
| **¿Qué pasa si se omite?** | **Android:** el pedido se deniega solo, sin diálogo (`canAskAgain: false`). **iOS:** la app se cierra (crash) al tocar el recurso, y App Store Connect rechaza la build si una API protegida no tiene su texto. | La API del recurso falla: en Android lanza `SecurityException`; en iOS devuelve "no autorizado". En Expo, la cámara no abre o la función de ubicación rechaza la promesa. Por eso la app siempre consulta antes de usar. |

### A3. Verdadero o falso

**a) F.** El diálogo lo dibuja el **sistema operativo**, fuera de la app. La app no puede cambiar ni su texto (en Android) ni sus botones. Lo único que la app dibuja es la **pantalla previa** que explica el beneficio antes de llamar al sistema.

**b) V.** Expo usa *Continuous Native Generation*: las carpetas `android/` e `ios/` se regeneran a partir de `app.json` en cada `prebuild` o build de EAS. Si edito el `AndroidManifest.xml` a mano, el próximo `prebuild` pisa el cambio.

**c) F.** Una actualización OTA (EAS Update) solo cambia el JavaScript y los assets. El `Info.plist` es parte del binario nativo, así que un permiso nuevo requiere **una build nueva** y pasar otra vez por la tienda.

**d) F.** Si el permiso no está declarado en el manifiesto, Android lo **deniega de inmediato sin mostrar el diálogo**. En Expo eso se ve como `status: 'denied'` con `canAskAgain: false`.

**e) F.** `expo-permissions` está **deprecado y fue eliminado** del SDK. Desde hace varias versiones cada módulo trae sus propias funciones de permisos (`useCameraPermissions` en `expo-camera`, `requestForegroundPermissionsAsync` en `expo-location`, etc.). La consigna de este TP prohíbe usarlo.

**f) V.** Las notificaciones son la excepción en iOS: el diálogo es fijo, armado por el sistema, y no hay ninguna clave `NS…UsageDescription` para ellas. Justamente por eso conviene una pantalla previa que explique el beneficio.

**g) V.** Con acceso limitado, la respuesta es `granted: true`, `status: 'granted'` y `accessPrivileges: 'limited'` (en `expo-image-picker` y `expo-media-library`). Si solo se mira `granted`, la app cree que tiene toda la galería.

**h) F.** No es confiable ni práctico: se pierden los datos de la app, en iOS el sistema puede recordar algunas decisiones (por ejemplo, la de notificaciones) y, si se prueba en **Expo Go**, el permiso es de Expo Go, no de la app. La forma confiable es:

- Android: `adb shell pm reset-permissions` (todas las apps) o `adb shell pm revoke <paquete> android.permission.CAMERA`;
- simulador de iOS: `xcrun simctl privacy booted reset camera <bundleId>`;
- iPhone físico: *Ajustes → General → Transferir o restablecer el iPhone → Restablecer → Restablecer localización y privacidad*.

### A4. Los estados de un permiso

**a) Diagrama de estados**

Android (11 o superior):

```
                     request()
  SIN DECIDIR ─────────────────────▶ diálogo
  (undetermined)                       │
        ▲                    ┌─────────┼──────────────┐
        │                 Permitir  No permitir   "Solo esta vez"
        │                    │         │              │
        │                    ▼         ▼              ▼
        │               CONCEDIDO   DENEGADO       CONCEDIDO
        │                           (canAskAgain   temporal ── al cerrar la app ──┐
        │                            = true)                                      │
        │                              │ request() → No permitir otra vez         │
        │                              ▼                                          │
        │                          BLOQUEADO (canAskAgain = false)                │
        │                              │ solo desde Ajustes                       │
        └──────────────────────────────┴──────────────────────────────────────────┘
```

iOS:

```
                     request()
  SIN DECIDIR ─────────────────────▶ diálogo (una sola vez)
  (notDetermined)                      │
                         ┌─────────────┴──────────────┐
                    Permitir                     No permitir
                         │                            │
                         ▼                            ▼
                     CONCEDIDO                BLOQUEADO (denied, canAskAgain = false)
                                                      │
                                       solo desde Ajustes de iOS
```

**Diferencia central:** iOS muestra el diálogo **una sola vez**; un "no" ya es definitivo para la app (solo se cambia en Ajustes). Android da **dos oportunidades**: después del primer "no" se puede volver a pedir, y recién el segundo "no" lo bloquea. Por eso en iOS es todavía más importante la pantalla previa: no hay segunda chance.

**b) Qué devuelve Expo en cada estado**

| Estado | status | canAskAgain | ¿Puede aparecer el diálogo? |
| --- | --- | --- | --- |
| Sin decidir | `'undetermined'` | `true` | Sí |
| Concedido | `'granted'` | `true` | No, ya está concedido (no hace falta) |
| Denegado (se puede volver a pedir) | `'denied'` | `true` | Sí (solo pasa en Android) |
| Bloqueado | `'denied'` | `false` | No, el sistema contesta "no" solo. Hay que ir a Ajustes |

En esta app esos estados se traducen a los cuatro que entiende la interfaz (hook `usePermiso`): `cargando` (la respuesta todavía es `null`), `concedido`, `preguntable` (sin decidir o denegado con `canAskAgain: true`) y `bloqueado`.

### Fuentes

- Android Developers, *Permissions on Android*: https://developer.android.com/guide/topics/permissions/overview
- Android Developers, *Request runtime permissions*: https://developer.android.com/training/permissions/requesting
- Apple Developer, *Requesting access to protected resources*: https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources
- Expo, *Permissions guide*: https://docs.expo.dev/guides/permissions/
- Expo, *ImagePicker (SDK 57)*, tipo `MediaLibraryPermissionResponse.accessPrivileges`: https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/
