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

---

## Parte B · Android: tipos de permisos y manifiesto

> B3 (leer el manifiesto) se responde en el módulo M70, con el `AndroidManifest.xml` real de la build.

### B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
| --- | --- | --- |
| `INTERNET` | De instalación (normal) | Se declara en el manifiesto y el sistema lo concede solo al instalar. Sin diálogo. |
| `CAMERA` | De tiempo de ejecución (peligroso) | Se declara y además se pide con el diálogo del sistema. En esta app: `useCameraPermissions()` → `pedirPermiso()` después de la explicación del escáner. |
| `VIBRATE` | De instalación (normal) | Se declara y se concede al instalar. |
| `SYSTEM_ALERT_WINDOW` | Especial | Se declara y la persona lo habilita a mano en *Ajustes → Mostrar sobre otras apps* (la app la lleva con el intent `ACTION_MANAGE_OVERLAY_PERMISSION`). Esta app **no** lo usa: lo bloqueo en M45. |
| `POST_NOTIFICATIONS` | De tiempo de ejecución (desde Android 13, API 33) | Se declara y se pide con diálogo. En Android 12 o anterior no existe: las notificaciones están permitidas por defecto. |
| `ACCESS_NETWORK_STATE` | De instalación (normal) | Se declara y se concede al instalar. |
| `READ_CONTACTS` | De tiempo de ejecución (peligroso) | Se declara y se pide con diálogo. |
| `SCHEDULE_EXACT_ALARM` | Especial (desde Android 12, API 31) | Se declara y la persona lo habilita en *Ajustes → Alarmas y recordatorios* (intent `ACTION_REQUEST_SCHEDULE_EXACT_ALARM`). Desde Android 13 viene **denegado** por defecto para las apps nuevas. |
| `RECORD_AUDIO` | De tiempo de ejecución (peligroso) | Se declara y se pide con diálogo. Esta app no lo declara (`recordAudioAndroid: false` en M22). |
| `MANAGE_EXTERNAL_STORAGE` | Especial (desde Android 11, API 30) | Se declara y la persona lo habilita en *Ajustes → Acceso a todos los archivos*. Google Play solo lo permite a apps cuya función principal lo necesita (exploradores de archivos, antivirus). |

### B2. Grupos y nombres

**a) Grupo de permisos.** Es una agrupación lógica que hace Android de permisos relacionados con el mismo recurso. Por ejemplo, el grupo *Ubicación* incluye `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION`. Sirve para que el diálogo hable del recurso ("¿Permitir que la app acceda a la ubicación?") y no de cada constante técnica.

Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, la persona ve **un solo diálogo**. Desde Android 12 ese diálogo además ofrece elegir entre *Precisa* y *Aproximada*. Es lo que hace `Location.requestForegroundPermissionsAsync()` en esta app: pide los dos y la respuesta trae `android.accuracy: 'fine' | 'coarse'`.

Android aclara que la composición de los grupos puede cambiar entre versiones, así que el código nunca debe asumir que un permiso concedido "trae" a otro del mismo grupo. Siempre se consulta cada permiso.

**b) Prefijo.** El nombre completo lleva el prefijo del paquete que lo define. Los del sistema empiezan con `android.permission.`. El de cámara es **`android.permission.CAMERA`**.

**c) Permisos de firma (signature).** El sistema los concede automáticamente solo si la app que los pide está **firmada con el mismo certificado** que la app que los define (por ejemplo, el sistema operativo del fabricante). No se usan en apps comunes porque una app publicada en Play está firmada con su propia clave, no con la del fabricante: aunque los declare, nunca se los conceden. Se usan entre apps del sistema o entre apps de una misma empresa que comparten firma.

### B4. Así pregunta Android

**a)** No. El diálogo de Android es del sistema y su texto es fijo: la app no puede agregar nada. Por eso la explicación va **antes**, en la pantalla de la app que pide el permiso. En esta app, el estado "preguntable" del escáner (M25) dice "Usamos tu cámara para leer el código QR del aula y completar el reporte solo", y recién al tocar "Continuar" aparece el diálogo del sistema.

**b)** "Mientras la app está en uso" concede el permiso de forma permanente, pero solo para cuando la app está en primer plano. "Solo esta vez" (permisos de una sola vez, desde **Android 11**) lo concede solo para esta sesión: cuando la persona sale de la app y pasa un rato, el sistema lo revoca y la próxima vez se vuelve a preguntar. Existe para **ubicación, cámara y micrófono**.

En el código esto significa que no puedo asumir que un permiso concedido ayer sigue concedido hoy: la app consulta el estado cada vez que entra a la función, y también al volver al primer plano (M47).

**c)** Desde Android 11, si la persona toca "No permitir" **dos veces** para el mismo permiso, el sistema lo toma como "no volver a preguntar": los siguientes `request…()` devuelven "denegado" sin mostrar el diálogo. `canAskAgain` pasa a ser **`false`**. Es exactamente el estado "bloqueado" del escáner: en vez de "Continuar" muestra "Abrir Ajustes" y la carga manual del aula (M25 y M28).

**d)** La ubicación aproximada da un área de unos 3 km².

- **Anda bien:** mostrar el clima de la ciudad, o "sedes del instituto cerca tuyo" en una ciudad como Formosa.
- **No anda:** saber en qué **sector del edificio** está el desperfecto, que es lo que necesita esta app. Por eso, si la ubicación es aproximada, la app muestra "Ubicación aproximada", no muestra coordenadas engañosas y deja elegir el sector a mano (M38–M40).

**e)** Android **mata el proceso** de la app. Cuando la persona vuelve, la app arranca de nuevo (Android intenta restaurar la última pantalla). Por eso el estado del permiso no se puede guardar en memoria "para siempre": hay que volver a consultarlo.

### B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
| --- | --- | --- |
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | Declarar en el manifiesto ya no alcanza para los peligrosos: hay que pedirlos con diálogo y manejar el "no". |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29) | `ACCESS_BACKGROUND_LOCATION` es otro permiso. Desde Android 11 se pide **después** del de primer plano y lleva a Ajustes. Esta app no lo usa. |
| Dos rechazos equivalen a "no volver a preguntar" | Android 11 (API 30) | Hay que leer `canAskAgain` y ofrecer "Abrir Ajustes" cuando es `false` (estado "bloqueado"). |
| Ubicación precisa o aproximada | Android 12 (API 31) | La respuesta puede venir con `accuracy: 'coarse'`. La app tiene que funcionar con menos precisión (M38). |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Hay que pedirlo. Además, si no hay ningún canal creado, el diálogo no aparece: el canal "reportes" se crea antes (M57). |
| Acceso parcial a fotos y videos ("Seleccionar fotos") | Android 14 (API 34) | `READ_MEDIA_VISUAL_USER_SELECTED`: el permiso puede ser parcial (`accessPrivileges: 'limited'`). Esta app evita el problema usando el selector del sistema (M43). |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 (API 37) | Las apps que apuntan a API 37 y buscan o se conectan a dispositivos de la red local tienen que pedirlo. Esta app no lo necesita. |

**`targetSdkVersion`** es la versión de Android para la que la app declara estar preparada. Android aplica los cambios de comportamiento de una versión **solo** a las apps que apuntan a esa versión o a una mayor. Por ejemplo, las reglas de `ACCESS_LOCAL_NETWORK` solo afectan a apps con `targetSdkVersion` 37.

**Expo SDK 57** apunta a **API 36 (Android 16)**: `targetSdk = 36` y `compileSdk = 36`, con mínimo API 24 (Android 7.0). Lo verifiqué en `node_modules/react-native/gradle/libs.versions.toml` y en `expo-modules-core`.

**Google Play** exige que, desde el **31 de agosto de 2026**, las apps nuevas y las actualizaciones apunten a **Android 16 (API 36) o superior**. Se podía pedir una prórroga hasta el 1 de noviembre de 2026. Con SDK 57, esta app ya lo cumple.

### Fuentes (Parte B)

- Android Developers, *Permissions on Android* (tipos, grupos, firma): https://developer.android.com/guide/topics/permissions/overview
- Android Developers, *Request runtime permissions* (una sola vez, dos rechazos, revocación): https://developer.android.com/training/permissions/requesting
- Android Developers, *Request location permissions* (precisa/aproximada, segundo plano): https://developer.android.com/develop/sensors-and-location/location/permissions
- Android Developers, *Notification runtime permission*: https://developer.android.com/develop/ui/views/notifications/notification-permission
- Android Developers, *Grant partial access to photos and videos*: https://developer.android.com/about/versions/14/changes/partial-photo-video-access
- Android Developers, *Schedule alarms* (`SCHEDULE_EXACT_ALARM`): https://developer.android.com/develop/background-work/services/alarms/schedule
- Android Developers, *Local network permission*: https://developer.android.com/privacy-and-security/local-network-permission
- Android Developers, *Meet Google Play's target API level requirement*: https://developer.android.com/google/play/requirements/target-sdk
- Google Play Console Help, *Target API level requirements*: https://support.google.com/googleplay/android-developer/answer/11926878

---

## Parte E · Recetas: leer y corregir código

### E1. Encontrá los errores (cámara)

Este código es casi igual a mi primer escáner (M23). Los problemas, en el orden en que los fui encontrando:

1. **Se rompe en el primer render.** `useCameraPermissions()` devuelve `null` mientras consulta al sistema, y `permiso.status` sobre `null` lanza *"Cannot read properties of null"*. En mi M23, TypeScript estricto no me dejó escribirlo así y tuve que usar `permiso?.granted`. Aun así, ese instante se trataba como "no concedido" y la explicación parpadeaba antes de la cámara. Lo corregí en M24 con un estado **cargando**.
2. **No distingue "preguntable" de "bloqueado".** Solo mira si está concedido. Si `canAskAgain` es `false`, tocar el botón llama a `pedirPermiso()`, el sistema contesta "no" sin mostrar nada y la persona siente que el botón no anda. Hace falta un cuarto estado con "Abrir Ajustes" (M25).
3. **El botón dice "Permitir".** Quien permite es el sistema, en su diálogo. El botón de la pantalla previa tiene que decir **"Continuar"** (Parte F2).
4. **La explicación está incompleta.** Falta aclarar que el permiso se puede cambiar en Ajustes. Además `Explicacion` no está importado, así que el archivo ni compila.
5. **No hay alternativa si se deniega.** La persona queda trabada en el escáner. Según la consigna, ningún permiso denegado puede impedir crear el reporte: hay que dejar escribir el aula a mano (M28).
6. **La cámara no lee nada.** Faltan `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}` y `onBarcodeScanned`, y evitar lecturas repetidas (M26).
7. **Está en `src/app/escanear.tsx`.** La consigna pide la ruta `/reporte/escanear`, o sea `src/app/reporte/escanear.tsx`.

Versión corregida con los cuatro estados (es la base de `src/app/reporte/escanear.tsx`, simplificada para la respuesta):

```tsx
// src/app/reporte/escanear.tsx
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRef } from 'react';
import { Linking } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { IngresoAulaManual } from '@/components/IngresoAulaManual';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function Escanear({ onAula }: { onAula: (aula: string) => void }) {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const yaLeido = useRef(false);

  function alLeer({ data }: BarcodeScanningResult) {
    if (yaLeido.current) return; // la cámara dispara muchas lecturas por segundo
    yaLeido.current = true;
    onAula(data);
  }

  // 1. Cargando
  if (!permiso) return <Cargando mensaje="Consultando el permiso de la cámara…" />;

  // 2. Concedido
  if (permiso.granted) {
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={alLeer}
      />
    );
  }

  // 3. Preguntable: explico el beneficio y un único botón "Continuar"
  if (permiso.canAskAgain) {
    return (
      <Pantalla centrada>
        <Texto>Usamos tu cámara para leer el código QR del aula y completar el reporte solo.</Texto>
        <Texto variante="secundario">Podés cambiar este permiso cuando quieras en Ajustes.</Texto>
        <Boton titulo="Continuar" onPress={pedirPermiso} />
      </Pantalla>
    );
  }

  // 4. Bloqueado: cómo habilitarlo + alternativa para no trabar el reporte
  return (
    <Pantalla>
      <Texto>Habilitá la cámara para esta app en Ajustes y volvé a esta pantalla.</Texto>
      <Boton titulo="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      <IngresoAulaManual onConfirmar={onAula} />
    </Pantalla>
  );
}
```

En la app real, además, el aula leída pasa por `leerCodigoAula` (M26–M27) y se guarda en el borrador del formulario (M29). Y después de un "no" se pasa directo a la carga manual, sin volver a explicar (M28).

Lo que esta versión **todavía** no resuelve, y que corrijo más adelante: si la persona habilita la cámara en Ajustes y vuelve, el hook no se entera y sigue mostrando "bloqueado". Eso se arregla con `AppState` (M47, Parte E5).
