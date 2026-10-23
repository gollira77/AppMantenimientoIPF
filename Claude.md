# CLAUDE.md — Mantenimiento IPF (TP N° 3: Permisos móviles)

## Contexto

App para que alumnos y docentes del Instituto Politécnico Formosa reporten desperfectos del edificio y reciban un aviso cuando se resuelven. Es el Trabajo Práctico N° 3 del Taller de React Native II. El tema central son los **permisos móviles en Android, iOS y Expo**.

La app tiene que funcionar en Android, iOS y Expo Go. La persona con la que trabajás es estudiante y va a defender este código en un oral. Por eso **enseñar es parte de la tarea**: cada decisión tiene que poder explicarse.

Respondé siempre en español (rioplatense).

## Stack obligatorio

- Proyecto creado con `npx create-expo-app@latest`, **Expo SDK 57**, TypeScript y Expo Router. Antes de seguir, verificá la versión del SDK en `package.json`.
- Paquetes de Expo instalados **solo** con `npx expo install` (expo-camera, expo-location, expo-image-picker, expo-notifications, expo-audio).
- **Prohibido usar `expo-permissions`**.
- Organización:
  - `src/app`: rutas
  - `src/components`: componentes
  - `src/hooks`: hooks
  - `src/lib`: lógica pura y servicios, sin React
- Calidad:
  - TypeScript `strict`
  - ESLint (`npx expo lint`) y Prettier
  - Jest con `jest-expo` y `@testing-library/react-native`
  - Husky, lint-staged y commitlint
  - GitHub Actions (lint, tipos, tests, `npx expo-doctor`)
- El SDK 57 puede ser más nuevo que tu conocimiento. Antes de usar la API de un módulo, **verificala en docs.expo.dev** (nombres de funciones, opciones de plugins, triggers de notificaciones). Si algo cambió respecto de este archivo, avisá y adaptá.

## Rutas requeridas (Expo Router)

| URL | Archivo | Permiso / detalle |
| --- | --- | --- |
| `/` | `(tabs)/index.tsx` | Lista de reportes propios con su estado. Tab "Reportes". Sin permisos. |
| `/reporte/nuevo` | `reporte/nuevo.tsx` | Formulario: título, descripción, aula y categoría (electricidad, agua, mobiliario, equipos). No pide ningún permiso al abrir. |
| `/reporte/escanear` | `reporte/escanear.tsx` | QR del aula con `useCameraPermissions`, cuatro estados. |
| `/reporte/foto` | `reporte/foto.tsx` | "Sacar foto" pide cámara; "Elegir de la galería" usa el selector del sistema, sin permiso. |
| `/reporte/ubicacion` | `reporte/ubicacion.tsx` | Ubicación en primer plano; si se deniega, el sector se elige a mano. |
| `/reporte/[id]` | `reporte/[id].tsx` | Valida el id y muestra un mensaje si no existe. Botón "Simular resolución". |
| `/avisos` | `(tabs)/avisos.tsx` | Bandeja de avisos, alternativa a las notificaciones. |
| `/permisos` | `(tabs)/permisos.tsx` | Panel de permisos que se actualiza al volver de Ajustes. |
| `/permisos/[recurso]` | `permisos/[recurso].tsx` | Pantalla previa al diálogo del sistema, `presentation: "modal"`. |
| `/ajustes-app` | `ajustes-app.tsx` | Interruptor "Avisarme cuando se resuelva mi reporte". |
| `/herramientas/qr` | `herramientas/qr.tsx` | Extra: generador de QR por aula para probar el escáner. |

## Requisitos funcionales (no negociables)

1. **Hook `usePermiso(recurso)`** en `src/hooks/usePermiso.ts`.
   - Devuelve `'cargando' | 'concedido' | 'preguntable' | 'bloqueado'`.
   - Devuelve un indicador `parcial` (fotos limitadas o ubicación aproximada).
   - Expone `pedir()` y `abrirAjustes()`.
   - Se actualiza al volver de Ajustes usando `AppState`.
2. **Escáner con cuatro estados**: cargando, cámara, explicación con "Continuar", o bloqueado con "Abrir Ajustes". Si la cámara se deniega, el código del aula se puede escribir a mano.
3. **Foto sin permiso de galería**: usa `launchImageLibraryAsync`. La app no declara `READ_MEDIA_IMAGES`.
4. **Ubicación**: solo primer plano.
   - Si es aproximada (Android `accuracy: 'coarse'`, iOS `accuracy: 'reduced'`), se muestra "Ubicación aproximada" y no las coordenadas.
   - Si se deniega, el reporte usa el sector elegido a mano.
5. **Notificaciones**:
   - Se piden solo al activar el interruptor de `/ajustes-app`.
   - En Android se crea el canal `"reportes"` antes de pedir.
   - "Simular resolución" programa una notificación local a los 10 s. Si el permiso está denegado, el aviso va a `/avisos`.
6. **Pantalla previa** antes de cada diálogo del sistema.
   - Muestra el beneficio en una frase, un único botón "Continuar" y la aclaración de que se puede cambiar en Ajustes.
   - Sin "Ahora no" ni "Cerrar" (pauta 5.1.1(iv) de Apple).
   - Si el permiso está bloqueado, explica cómo habilitarlo y el botón pasa a ser "Abrir Ajustes".
7. **La app nunca se bloquea**: ningún permiso denegado impide crear un reporte.
8. **No insistir**: después de un "no", la pantalla previa solo vuelve a aparecer cuando la persona toca otra vez la función.
9. **Panel `/permisos`**: muestra cada recurso con su estado, `Platform.OS` y el matiz (`accuracy`, `accessPrivileges`, provisional). La galería figura como "no requerida (selector del sistema)".
10. **`app.json`**:
    - Un plugin por módulo.
    - Textos de propósito con el molde "Usamos tu [dato] para [beneficio concreto]".
    - En expo-camera: `microphonePermission: false` y `recordAudioAndroid: false`.
    - `blockedPermissions` con los permisos que la app no usa, cada uno justificado en el README.

## Cómo trabajar: el código evoluciona

No escribas la versión final de entrada. Seguí los módulos **en orden**. Los marcados **(evolución)** son refactors que nacen de un problema real del módulo anterior.

- Implementá primero la versión simple tal como dice el módulo, aunque sepas que después cambia. Por ejemplo, M23 es el escáner ingenuo y M33 copia la lógica de la cámara a propósito.
- En el módulo de evolución, explicá qué problema apareció y por qué el nuevo diseño lo resuelve.

## Git

- Trabajá **todo en la rama `develop`**. `main` solo recibe el merge final (M78) con el tag `v1.0.0`.
- **Un módulo = un commit**, con el mensaje exacto de la lista de abajo.
- Formato: `tipo(ámbito): mensaje en primera persona y en pasado`. El tipo va en minúscula (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, `style`, `perf`).
- Commits con la fecha y hora reales. **No modifiques fechas** (`GIT_AUTHOR_DATE`, `GIT_COMMITTER_DATE`, `--date`, rebase de fechas). No reescribas el historial ya commiteado.
- Antes de cada commit: `npx tsc --noEmit`, `npx expo lint` y `npm test` tienen que pasar.

## Protocolo de cada módulo

1. Decí en una línea qué módulo arrancás.
2. Implementalo.
3. Corré tipos, lint y tests.
4. Hacé el commit.
5. Agregá una entrada a `docs/bitacora.md` con tres partes: **Qué hice**, **Por qué** y **Qué podría preguntar el docente** (con la respuesta). Este archivo es el material de estudio para la defensa. Va en el mismo commit del módulo.

Al **terminar cada fase, detenete**. Mostrá qué probar en Expo Go (pasos concretos en Android y en iOS) y esperá la confirmación antes de seguir.

## Cuándo pedir intervención humana

- Logins y cuentas (`eas login`, GitHub, Apple).
- Builds en la nube (`eas build`).
- Pruebas en el celular y capturas de pantalla.
- Cualquier comando interactivo.

En esos casos, dejá el comando exacto y esperá.

## RESPUESTAS.md (Partes A–F)

Las respuestas se escriben en el módulo indicado, usando el código del proyecto como ejemplo:

| Módulo | Partes |
| --- | --- |
| M04 | A |
| M31 | B1, B2, B4, B5, E1 |
| M41 | C1, C3, C4, D1–D4, E2 |
| M46 | E4, F3 |
| M63 | E3, E5, F1, F2 |
| M70 | B3, C2, C5, D5, D6, F4, F5 |

Los datos de fechas o versiones de Android, Google Play y Apple se verifican en las fuentes oficiales y se citan.

## Módulos y commits

### Fase 0 · Preparación
- M01 `chore: creé el proyecto con create-expo-app en Expo SDK 57`
- M02 `chore: limpié la plantilla y dejé las rutas en src/app`
- M03 `docs: escribí el README inicial y creé la rama develop`
- M04 `docs(respuestas): respondí la Parte A sobre qué es un permiso`

### Fase 1 · Calidad
- M05 `chore: activé TypeScript estricto, ESLint y Prettier`
- M06 `test: configuré Jest con jest-expo y escribí el primer test`
- M07 `chore: agregué husky y commitlint para validar cada commit`
- M08 `ci: configuré lint, tipos y tests en cada push`
- M09 `chore: agregué la plantilla de pull request y cerré la fase de calidad`

### Fase 2 · Navegación
- M10 `feat(navegacion): armé las tabs Reportes, Avisos y Permisos`
- M11 `feat(navegacion): creé las rutas de reporte y ajustes-app vacías`
- M12 `feat(navegacion): agregué la pantalla previa como modal y la página 404`
- M13 `test(navegacion): verifiqué que cada URL de G1 abre su pantalla`
- M14 `feat(ui): creé el tema y los componentes base`

### Fase 3 · Reportes v1
- M15 `feat(reportes): definí los tipos de reporte, categoría y estado`
- M16 `feat(reportes): mostré la lista de reportes con datos de prueba` (con `useState`)
- M17 `feat(reportes): armé el formulario de nuevo reporte`
- M18 `feat(reportes): validé el formulario con zod`
- M19 `test(reportes): cubrí los casos inválidos del formulario`
- M20 `feat(reportes): validé el id del detalle y mostré un mensaje si no existe`
- M21 (evolución) `refactor(reportes): moví los reportes a un contexto porque la lista no veía los nuevos`

### Fase 4 · Cámara
- M22 `build(camara): configuré el plugin de expo-camera sin micrófono`
- M23 `feat(camara): mostré la cámara en /reporte/escanear` (versión ingenua: solo mira `granted`)
- M24 `fix(camara): manejé el primer render donde el permiso todavía es null`
- M25 `feat(camara): separé los cuatro estados del permiso de cámara`
- M26 `feat(camara): leí el QR del aula y evité lecturas repetidas`
- M27 `test(camara): probé el parser de códigos de aula`
- M28 `feat(camara): permití cargar el aula a mano si se deniega la cámara`
- M29 (evolución) `refactor(reportes): creé un borrador compartido para que el escáner complete el aula`
- M30 `feat(herramientas): agregué un generador de QR por aula para probar el escáner`
- M31 `docs(respuestas): respondí la Parte B y E1 comparando con mi primer escáner`

### Fase 5 · Ubicación y refactor de permisos
- M32 `build(ubicacion): configuré expo-location solo en primer plano`
- M33 `feat(ubicacion): pedí la ubicación en /reporte/ubicacion` (duplica la lógica de cámara a propósito)
- M34 (evolución) `refactor(permisos): extraje interpretarRespuesta porque duplicaba la lógica de cámara`
- M35 `test(permisos): cubrí cada PermissionResponse de la tabla D3`
- M36 (evolución) `refactor(permisos): unifiqué cámara y ubicación en el hook usePermiso`
- M37 `test(permisos): probé usePermiso con los módulos de Expo simulados`
- M38 `feat(ubicacion): detecté la ubicación aproximada en Android e iOS`
- M39 `feat(ubicacion): oculté las coordenadas cuando la ubicación es aproximada`
- M40 `feat(ubicacion): permití elegir el sector a mano si se deniega`
- M41 `docs(respuestas): respondí la Parte C y D4 simulando el ciclo en mi dispositivo`

### Fase 6 · Fotos
- M42 `build(fotos): configuré expo-image-picker sin permiso de galería`
- M43 `feat(fotos): elegí la foto desde el selector del sistema sin pedir permiso`
- M44 `feat(fotos): saqué la foto reutilizando el permiso de cámara`
- M45 `build(android): bloqueé los permisos que la app no usa y lo verifiqué con un test`
- M46 `docs(respuestas): respondí E4 y F3 sobre fotos y mínimo privilegio`

### Fase 7 · Ajustes, pantallas previas y panel
- M47 (evolución) `fix(permisos): actualicé el estado al volver de Ajustes con AppState`
- M48 `test(permisos): simulé el regreso desde Ajustes`
- M49 `feat(permisos): creé la pantalla previa con un único botón Continuar`
- M50 `feat(permisos): mostré Abrir Ajustes en la pantalla previa si está bloqueado`
- M51 `feat(permisos): conecté cada función con su pantalla previa`
- M52 `fix(permisos): dejé de mostrar la pantalla previa sola después de un no`
- M53 (evolución) `refactor(permisos): creé el registro de permisos porque el panel no podía llamar hooks en un bucle`
- M54 `feat(permisos): armé el panel con estado, plataforma y matiz de cada permiso`
- M55 `feat(permisos): registré cada consulta y pedido en un diario visible en el panel`

### Fase 8 · Notificaciones
- M56 `build(notificaciones): configuré expo-notifications`
- M57 `feat(notificaciones): creé el canal reportes antes de pedir el permiso`
- M58 `feat(notificaciones): pedí el permiso solo al activar el interruptor`
- M59 `feat(notificaciones): programé la notificación local de resolución a los 10 s`
- M60 (evolución) `refactor(notificaciones): creé un servicio de avisos con la bandeja como alternativa`
- M61 `feat(avisos): mostré la bandeja de avisos con contador de no leídos`
- M62 `feat(notificaciones): abrí el reporte al tocar la notificación`
- M63 `docs(respuestas): respondí E3, E5 y la Parte F1 y F2 con mi código`

### Fase 9 · Persistencia
- M64 (evolución) `refactor(reportes): guardé los reportes en AsyncStorage detrás de un repositorio`
- M65 `test(reportes): probé el repositorio en memoria y persistí avisos y borrador`

### Fase 10 · Builds nativas (requieren intervención humana)
- M66 `build: configuré los perfiles development, preview y production`
- M67 `docs(build): audité el AndroidManifest generado permiso por permiso`
- M68 `build(android): generé la development build y capturé mi texto de propósito`
- M69 `test(config): verifiqué que cada texto de propósito siga el molde`
- M70 `docs(respuestas): respondí B3, D6 y F5 con la build real`

### Fase 11 · Extras
- M71 `feat(notificaciones): pedí notificaciones provisionales en iOS y las mostré en el panel`
- M72 `feat(permisos): mostré el camino exacto en Ajustes según la plataforma`
- M73 `feat(audio): agregué la nota de voz activando el micrófono solo para esa función`
  - Requiere quitar `RECORD_AUDIO` de `blockedPermissions` y hacer una build nueva.
  - Explicar en la bitácora por qué no alcanza con OTA.
- M74 `feat(ui): agregué etiquetas de accesibilidad y modo oscuro`
- M75 `test: documenté la lista de pruebas manuales por plataforma`

### Fase 12 · Entrega
- M76 `docs: completé el README con árbol, plugins, tabla de permisos y capturas`
- M77 `docs: preparé el guion de la defensa oral`
- M78 `chore(release): publiqué la versión 1.0.0`
  - `git checkout main && git merge --no-ff develop && git tag v1.0.0`
  - Pedir confirmación antes del push.

### Fase 13 · 3D (NO empezar sin confirmación explícita)

Al cerrar M78, preguntá si se integra. Si la respuesta es sí, se trabaja sobre `develop` y luego se mergea a `main` con el tag `v1.1.0`.

- M79 `chore(3d): instalé expo-gl, three y react-three-fiber`
- M80 `feat(3d): modelé el edificio del instituto con bloques`
- M81 `feat(3d): ubiqué cada reporte como un pin coloreado por estado`
- M82 `feat(3d): permití rotar el edificio con gestos`
- M83 `feat(3d): abrí el detalle del reporte al tocar su pin`
- M84 `perf(3d): agregué una vista 2D de respaldo para dispositivos lentos`