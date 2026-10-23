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

---

## M02 · Limpié la plantilla y dejé las rutas en src/app

**Qué hice**

- Borré los componentes, hooks, constantes, estilos CSS e imágenes de ejemplo de la plantilla, y el script `reset-project`.
- Dejé `src/app/_layout.tsx` con un `Stack` y `src/app/index.tsx` con una pantalla mínima.
- Creé las carpetas `src/components`, `src/hooks` y `src/lib` (con `.gitkeep` para que Git las guarde vacías).

**Por qué**

- La plantilla trae una demo (tabs nativas, íconos animados) que no tiene nada que ver con la app. Si la dejaba, iba a terminar mezclando código ajeno con el mío y no lo podría defender.
- La consigna separa las capas: `src/app` solo rutas, `src/components` UI, `src/hooks` hooks y `src/lib` lógica pura sin React. Separar `lib` permite testear la lógica sin renderizar nada.
- No usé `npm run reset-project` porque es interactivo y además deja una carpeta `example` que no quiero en el repo.

**Qué podría preguntar el docente**

- *¿Por qué las rutas están en `src/app` y no en `app`?* — Expo Router busca primero `app/` y, si no existe, `src/app/`. La plantilla del SDK 57 ya usa `src/app`, y así todo el código fuente queda bajo `src`.
- *¿Qué pasa si pongo un componente dentro de `src/app`?* — Expo Router lo toma como una ruta. Por eso los componentes van en `src/components`.
- *¿Para qué sirve `_layout.tsx`?* — Define el navegador que envuelve a las pantallas de esa carpeta. Acá es un `Stack`; en M10 se agregan las tabs.

---

## M03 · Escribí el README inicial y creé la rama develop

**Qué hice**

- Reemplacé el README de la plantilla por uno propio: de qué trata la app, el stack, cómo correrla, la estructura de carpetas y el flujo de Git.
- Creé la rama `develop` a partir de `main`. Desde este commit todo el trabajo va en `develop`.

**Por qué**

- El README es lo primero que ve quien abre el repo (incluido el docente). Tiene que explicar qué es la app y cómo levantarla sin leer el código.
- Separar `develop` de `main` es una versión simple de Git Flow: `main` queda siempre estable y solo recibe la versión entregable (merge final con el tag `v1.0.0`). Si algo se rompe en el desarrollo, `main` no se entera.

**Qué podría preguntar el docente**

- *¿Por qué no trabajás directo en `main`?* — Porque `main` representa lo que se entrega. Trabajando en `develop` puedo commitear módulo por módulo, aunque el trabajo esté a medias, sin ensuciar la versión estable.
- *¿Cómo llega el código a `main`?* — Con un `git merge --no-ff develop` al final (M78). El `--no-ff` fuerza un commit de merge, así en el historial se ve claramente cuándo entró la versión 1.0.0.
- *¿Por qué los commits tienen ese formato?* — Es Conventional Commits: `tipo(ámbito): mensaje`. El tipo (`feat`, `fix`, `refactor`…) dice qué clase de cambio es, y en M07 commitlint lo valida automáticamente.

---

## M04 · Respondí la Parte A sobre qué es un permiso

**Qué hice**

- Creé `RESPUESTAS.md` y escribí la Parte A: qué es un permiso, para qué existe, la diferencia entre declararlo y pedirlo, los tipos de permisos en Android e iOS, sus estados y quién decide.
- Cité las fuentes oficiales (Android Developers, Apple Developer y docs.expo.dev).

**Por qué**

- Antes de escribir código de permisos necesito tener claro el modelo: si confundo "declarar" (en la build) con "pedir" (en ejecución), después no entiendo por qué un pedido falla.
- Adelanté la tabla de los cuatro estados (`cargando`, `concedido`, `preguntable`, `bloqueado`) porque es la base del hook `usePermiso` que voy a construir más adelante.

**Qué podría preguntar el docente**

- *¿Cuál es la diferencia entre declarar y pedir un permiso?* — Declarar es avisarle al sistema, en la build, que la app puede llegar a usar un recurso (`AndroidManifest.xml` o `Info.plist`). Pedir es mostrar el diálogo en ejecución. Sin declarar, no se puede pedir.
- *¿Desde qué versión Android pide permisos en ejecución?* — Desde Android 6.0 (API 23). Antes se aceptaban todos al instalar.
- *¿Qué significa `canAskAgain: false`?* — Que el sistema ya no va a mostrar el diálogo (por ejemplo, la persona denegó dos veces en Android o una vez en iOS). La única salida es mandarla a Ajustes.
- *¿Qué es un permiso parcial?* — Uno concedido pero con menos alcance: ubicación aproximada en vez de precisa, o acceso solo a algunas fotos.

---

## M04 (corrección) · Reescribí la Parte A con el enunciado oficial

**Qué hice**

- Guardé el enunciado completo de las Partes A–F en `docs/consignas.md`.
- Reescribí la Parte A de `RESPUESTAS.md` siguiendo la numeración oficial: A1 (conceptos, sandbox, cuatro razones, analogía del portero), A2 (tabla declarar/solicitar), A3 (verdadero o falso) y A4 (diagramas de estados y tabla de Expo).

**Por qué**

- En M04 respondí la Parte A sin tener el enunciado literal. Cuando lo recibí, lo corregí en un commit nuevo en lugar de modificar el de M04, porque la consigna pide no reescribir el historial.

**Qué podría preguntar el docente**

- *¿Por qué hay un commit que no está en la lista de módulos?* — Porque corregí la Parte A después de recibir el enunciado. Preferí un commit honesto a reescribir el historial con `--amend` o `rebase`.
- *¿Cuál es la diferencia central entre Android e iOS en los estados?* — iOS muestra el diálogo una sola vez; Android da dos oportunidades y recién el segundo "no" bloquea.

---

## M05 · Activé TypeScript estricto, ESLint y Prettier

**Qué hice**

- `tsconfig.json`: además de `strict`, activé `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `forceConsistentCasingInFileNames`.
- ESLint con la configuración plana (`eslint.config.js`) de `eslint-config-expo`, más `eslint-plugin-prettier/recommended` para que un error de formato sea un error de lint.
- Prettier con `.prettierrc` (comillas simples, 100 columnas, coma final, fin de línea LF). Excluí los `.md` porque Prettier rellena las tablas con espacios y quedan ilegibles en texto plano.
- `.gitattributes` y `.editorconfig` para forzar LF y no tener diferencias falsas entre Windows y el CI de Linux.
- Scripts nuevos: `typecheck`, `format` y `format:check`.

**Por qué**

- `strict` obliga a manejar `null` y `undefined`. Esto es clave en esta app: el permiso de cámara vale `null` en el primer render, y con `strict` TypeScript no me deja leer `permiso.granted` sin chequearlo antes.
- `noUncheckedIndexedAccess` hace que `lista[0]` sea `T | undefined`. Lo voy a necesitar al buscar un reporte por id: si no existe, el tipo me obliga a mostrar el mensaje de "no encontrado".
- ESLint encuentra errores (por ejemplo, reglas de hooks) y Prettier se encarga solo del formato, así no discuto estilo en las revisiones.

**Qué podría preguntar el docente**

- *¿Qué diferencia hay entre ESLint y Prettier?* — ESLint analiza el código y detecta errores o malas prácticas (por ejemplo, llamar un hook dentro de un `if`). Prettier solo reescribe el formato. Los conecté para que `npx expo lint` falle si el formato no está bien.
- *¿Qué agrega `strict`?* — Entre otras cosas, `strictNullChecks` (null y undefined son tipos aparte) y `noImplicitAny` (prohíbe los `any` implícitos).
- *¿Por qué LF y no CRLF?* — El CI corre en Linux. Si en Windows los archivos tienen CRLF, Prettier marca todos los archivos como mal formateados.

---

## M06 · Configuré Jest con jest-expo y escribí el primer test

**Qué hice**

- Instalé `jest`, `jest-expo`, `@types/jest` y `@testing-library/react-native` 13 (con `npx expo install`, para que las versiones coincidan con el SDK 57).
- Configuré Jest en `package.json` con el preset `jest-expo` y el `transformIgnorePatterns` que recomienda la guía de Expo. Ignoré `src/app` como carpeta de tests.
- Scripts: `npm test` (una corrida, para el CI y los hooks), `test:watch` y `test:coverage`.
- Primer test en `src/__tests__/inicio.test.tsx`: renderiza la pantalla de inicio y verifica que aparece "Mantenimiento IPF".

**Por qué**

- `jest-expo` ya simula (mockea) la parte nativa de los módulos de Expo. Sin eso, importar `expo-camera` en un test fallaría porque en Node no hay cámara.
- En el SDK 57, `expo-router/testing-library` funciona solo con Testing Library **13** (la 14 es para el SDK 58). La versión 13 necesita `react-test-renderer` como dependencia par: la fijé en `19.2.3`, igual que React, porque npm intentaba traer la 19.3.1 y chocaba.
- Los tests no van dentro de `src/app` porque Expo Router trataría cada archivo como una ruta.
- TypeScript 6 ya no carga automáticamente todos los `@types`, así que agregué `"types": ["jest"]` en `tsconfig.json` (como indica la guía de Expo).

**Qué podría preguntar el docente**

- *¿Qué es un preset de Jest?* — Una configuración base. `jest-expo` define cómo transformar el código (Babel), qué archivos son tests y los mocks de los módulos nativos.
- *¿Para qué sirve `transformIgnorePatterns`?* — Jest no transforma `node_modules` por defecto, pero React Native y Expo publican código sin compilar. Ese patrón le dice que sí transforme esos paquetes.
- *¿Por qué `getByText` y no buscar por estilo o por id interno?* — Testing Library propone probar lo que ve la persona usuaria. Si cambio la implementación pero el texto sigue, el test sigue pasando.

---

## M07 · Agregué husky y commitlint para validar cada commit

**Qué hice**

- Instalé `husky`, `lint-staged`, `@commitlint/cli` y `@commitlint/config-conventional` (con `npm`, porque no son módulos de Expo).
- `npx husky init` agregó el script `prepare` y la carpeta `.husky`.
- Hook `pre-commit`: corre `lint-staged` (ESLint y Prettier solo sobre los archivos en stage), `npm run typecheck` y `npm test`.
- Hook `commit-msg`: corre `commitlint` sobre el mensaje.
- `commitlint.config.js`: extiende Conventional Commits, limita los tipos a los diez de la consigna y exige el tipo en minúscula.
- Probé los 84 mensajes de la lista de módulos contra commitlint y pasan todos.

**Por qué**

- La consigna pide que tipos, lint y tests pasen antes de cada commit. Con el hook no depende de que me acuerde: si algo falla, el commit no se hace.
- `lint-staged` revisa solo lo que voy a commitear, así el hook es rápido. Los tipos y los tests sí corren sobre todo el proyecto, porque un cambio en un archivo puede romper otro.
- Subí el largo máximo del encabezado a 120 caracteres porque algunos mensajes de la consigna (por ejemplo, el de M21) superan los 100 que trae por defecto.

**Qué podría preguntar el docente**

- *¿Qué es un hook de Git?* — Un script que Git ejecuta en un momento del ciclo (antes de commitear, al escribir el mensaje, antes de pushear). Husky los versiona dentro del repo para que todo el equipo tenga los mismos.
- *¿Qué rechaza commitlint?* — Por ejemplo `Feat: Algo`: el tipo en mayúscula, un tipo que no está en la lista o un asunto que empieza con mayúscula.
- *¿Se puede saltear el hook?* — Sí, con `--no-verify`, pero no lo uso. Además el CI (M08) repite las mismas verificaciones en GitHub, así que no sirve de nada saltearlo.

---

## M08 · Configuré lint, tipos y tests en cada push

**Qué hice**

- Creé `.github/workflows/ci.yml`. Corre en cada push y pull request a `main` y `develop`, sobre Ubuntu con Node 22.
- Pasos: `npm ci`, generar `expo-env.d.ts`, `npx expo lint`, `npm run format:check`, `npm run typecheck`, `npm test -- --ci` y `npx expo-doctor`.
- Corrí `npx expo-doctor` en mi máquina antes de subirlo: 21/21 verificaciones OK.

**Por qué**

- Los hooks de Husky corren en mi computadora y se pueden saltear. El CI es la verificación que no depende de mí: corre en una máquina limpia, igual para todos.
- `npm ci` (y no `npm install`) instala exactamente lo que dice `package-lock.json` y falla si no coincide con `package.json`. Así el CI prueba las mismas versiones que yo.
- `expo-env.d.ts` está en `.gitignore` (lo genera Expo al arrancar), así que en el CI lo creo a mano para que TypeScript conozca los tipos de Expo.
- `expo-doctor` revisa que las versiones de los paquetes sean compatibles con el SDK 57 y que la configuración sea válida. Es lo que más rápido detecta un paquete instalado con `npm` en vez de `npx expo install`.

**Qué podría preguntar el docente**

- *¿Qué diferencia hay entre el hook de pre-commit y el CI?* — El hook es local y rápido (avisa antes de commitear). El CI es remoto y obligatorio: si falla, se ve en GitHub con una cruz roja en el commit.
- *¿Qué hace `--ci` en Jest?* — Desactiva el modo interactivo y hace que los snapshots nuevos fallen en lugar de escribirse solos.
- *¿Por qué Node 22?* — Es una versión LTS compatible con el SDK 57. En mi máquina uso Node 24, que también es compatible.

---

## M09 · Agregué la plantilla de pull request y cerré la fase de calidad

**Qué hice**

- Creé `.github/pull_request_template.md`. GitHub la carga sola cada vez que alguien abre un pull request.
- La plantilla pide: qué cambia, por qué, qué permisos toca, cómo se probó en cada plataforma y un checklist con las reglas de la app (no bloquear, pantalla previa, bitácora).
- Verifiqué que el CI de M08 corrió en GitHub y terminó en verde.

**Por qué**

- En una app de permisos, lo más peligroso de un cambio es tocar `app.json` sin darse cuenta: eso exige una build nueva y no se puede arreglar con una actualización OTA. La plantilla obliga a marcarlo.
- El checklist repite las reglas no negociables de la consigna (la app nunca se bloquea, pantalla previa con "Continuar"), así quien revisa sabe qué mirar.

**Resumen de la fase de calidad (M05–M09)**

| Capa | Herramienta | Cuándo corre |
| --- | --- | --- |
| Tipos | TypeScript `strict` | Editor, pre-commit y CI |
| Errores y formato | ESLint + Prettier | Editor, pre-commit (`lint-staged`) y CI |
| Comportamiento | Jest + Testing Library | Pre-commit y CI |
| Mensajes de commit | commitlint | Hook `commit-msg` |
| Compatibilidad con el SDK | `expo-doctor` | CI |

**Qué podría preguntar el docente**

- *¿Para qué una plantilla de PR si trabajás solo?* — Me obliga a revisar mi propio cambio antes de mergearlo, y deja documentado cómo lo probé en cada plataforma.
- *¿Qué cambios de permisos no se pueden publicar por OTA?* — Todo lo que cambia el binario nativo: agregar o quitar un plugin, cambiar un texto de propósito del `Info.plist` o tocar `blockedPermissions`. Una actualización OTA solo cambia el JavaScript y los assets.

---

## M10 · Armé las tabs Reportes, Avisos y Permisos

**Qué hice**

- Creé el grupo `src/app/(tabs)` con su `_layout.tsx` y tres pantallas: `index.tsx` (Reportes), `avisos.tsx` y `permisos.tsx`.
- Moví la pantalla de inicio a `(tabs)/index.tsx`, así `/` abre la tab Reportes.
- El layout raíz (`src/app/_layout.tsx`) es un `Stack` que contiene las tabs sin encabezado propio. Las pantallas de reporte, ajustes y la pantalla previa van a abrirse **encima** de las tabs.
- Íconos con `@expo/vector-icons` (Ionicons), instalado con `npx expo install`.
- Verifiqué con `npx expo export --platform android` que Metro arma el bundle sin errores.

**Por qué**

- Los paréntesis de `(tabs)` hacen un **grupo**: organiza archivos sin agregar un segmento a la URL. Por eso la tab Avisos es `/avisos` y no `/tabs/avisos`, como pide la tabla de rutas.
- Stack afuera y tabs adentro: así una pantalla como `/reporte/nuevo` tapa la barra de tabs y tiene botón "atrás".
- En el SDK 57, importar `Tabs` desde `expo-router` está **deprecado**: la documentación de tipos indica `import { Tabs } from 'expo-router/js-tabs'`. Lo verifiqué en los tipos del paquete instalado antes de usarlo.
- El ícono de la tab recibe `color` como `ColorValue` (no `string`). TypeScript estricto lo marcó y ajusté el tipo.

**Qué podría preguntar el docente**

- *¿Qué es un grupo de rutas?* — Una carpeta entre paréntesis. Sirve para compartir un layout (acá, la barra de tabs) sin que el nombre aparezca en la URL.
- *¿Por qué ninguna tab pide permisos?* — Porque abrir una pantalla no es el momento de pedir: el permiso se pide cuando la persona toca la función que lo necesita (escanear, sacar foto, activar avisos).
- *¿Qué diferencia hay entre `expo-router/js-tabs` y las tabs nativas de la plantilla?* — `js-tabs` dibuja la barra con React Navigation (JavaScript) y se ve igual en las dos plataformas. Las nativas (`unstable-native-tabs`) usan los componentes del sistema y todavía son inestables.

---

## M11 · Creé las rutas de reporte y ajustes-app vacías

**Qué hice**

- Creé las pantallas vacías (solo título y una línea de texto): `reporte/nuevo`, `reporte/escanear`, `reporte/foto`, `reporte/ubicacion`, `reporte/[id]`, `ajustes-app` y `herramientas/qr`.
- Las registré en el `Stack` raíz con su título.
- En la tab Reportes agregué dos `Link`: "Nuevo reporte" y "Ajustes de la app".
- `reporte/[id].tsx` lee el parámetro con `useLocalSearchParams<{ id: string }>()`.
- Ajustes de herramientas que aparecieron al hacer esto:
  - **Tipos de rutas:** `typedRoutes` genera `.expo/types/router.d.ts` con las URLs válidas, pero solo se actualiza con el servidor de desarrollo. Agregué el script `tipos:rutas` (`expo customize tsconfig.json`, que los regenera sin levantar Metro) y lo encadené en `typecheck`. El CI usa el mismo script.
  - **Jest:** `Link` importa el paquete `standard-navigation`, que viene como módulo ESM sin compilar. Lo agregué a `transformIgnorePatterns`.

**Por qué**

- Primero armo el "mapa" de la app con pantallas vacías y después las lleno. Así puedo probar la navegación completa (M13) antes de escribir la lógica.
- `[id]` entre corchetes es un **segmento dinámico**: `/reporte/abc` y `/reporte/123` abren el mismo archivo con distinto `id`.
- Con `typedRoutes`, `<Link href="/reporte/nuevoo">` es un error de TypeScript. Me di cuenta porque los tipos viejos no conocían las rutas nuevas y `tsc` falló: por eso los regenero antes de chequear tipos.

**Qué podría preguntar el docente**

- *¿Qué diferencia hay entre `reporte/nuevo.tsx` y `reporte/[id].tsx` si las dos están en la misma carpeta?* — `nuevo` es una ruta estática y tiene prioridad. `/reporte/nuevo` abre el formulario; cualquier otro valor (`/reporte/7`) cae en `[id]`.
- *¿Qué son las typed routes?* — Expo Router genera tipos con todas las URLs de `src/app`. Si escribo mal una ruta en un `Link` o en `router.push`, TypeScript lo marca antes de ejecutar.
- *¿Ya se pide algún permiso?* — No. Las pantallas de escanear, foto y ubicación existen pero no tocan ningún módulo nativo todavía.

---

## M12 · Agregué la pantalla previa como modal y la página 404

**Qué hice**

- Creé `src/app/permisos/[recurso].tsx`, la futura pantalla previa al diálogo del sistema. Por ahora solo muestra qué recurso se va a pedir (`/permisos/camara`, `/permisos/ubicacion`…).
- La registré en el `Stack` raíz con `presentation: 'modal'` y título "Antes de continuar".
- Creé `src/app/+not-found.tsx`: cualquier URL que no exista muestra "Esta pantalla no existe" y un enlace para volver a la lista de reportes.

**Por qué**

- La pantalla previa es un **modal** porque interrumpe una tarea (estoy escaneando, sacando una foto) y después vuelvo a ella. En iOS el modal sube desde abajo y se ve como algo "de paso", no como una sección más de la app.
- `[recurso]` es dinámico: una sola pantalla sirve para cámara, ubicación y notificaciones. El texto cambia según el recurso (M49).
- La página 404 es importante porque la app recibe enlaces desde afuera: al tocar una notificación se abre `/reporte/<id>` (M62). Si la URL está mal, la persona tiene que ver un mensaje y una salida, no una pantalla rota.

**Qué podría preguntar el docente**

- *¿Por qué el archivo se llama `+not-found`?* — Los archivos con `+` son especiales en Expo Router. `+not-found` es la pantalla que se muestra cuando ninguna ruta coincide con la URL.
- *¿`/permisos` y `/permisos/camara` no chocan?* — No. `/permisos` es la tab (`(tabs)/permisos.tsx`, el grupo no suma a la URL) y `/permisos/camara` es el modal (`permisos/[recurso].tsx`). Son URLs distintas.
- *¿Por qué la pantalla previa no tiene botón "Cerrar"?* — Por la pauta 5.1.1(iv) de Apple: antes del diálogo del sistema no se puede ofrecer una salida que evite la pregunta. Va a tener un único botón "Continuar" (M49).

---

## M13 · Verifiqué que cada URL de G1 abre su pantalla

**Qué hice**

- Escribí `src/__tests__/rutas.test.tsx` con `renderRouter` de `expo-router/testing-library`, que monta el router real usando la carpeta `src/app`.
- Para cada URL de la tabla de rutas (G1) verifico que el router queda en esa URL (`getPathname()`) y que **no** aparece la página 404.
- Tests extra: `/reporte/42` cae en el segmento `[id]`, `/permisos/camara` cae en `[recurso]` y una URL inexistente muestra la 404.
- Agregué `jest.setup.ts` con un mock de los íconos de Ionicons.

**Por qué**

- Probar la navegación a mano en el celular en cada cambio es lento. Con este test, si alguien mueve o renombra un archivo de `src/app` y rompe una URL, el CI lo detecta.
- Al principio comparaba también el texto de cada pantalla, pero eso es frágil: cuando llene las pantallas cambian los textos y el test fallaría sin que la navegación esté rota. Lo que importa acá es **URL → pantalla**, no el contenido.
- Primero usé `expect(screen).toHavePathname(...)` como en la documentación, pero el hook de pre-commit lo frenó: en el SDK 57 ese matcher no está tipado para TypeScript. Uso los métodos del resultado de `renderRouter` (`getPathname`, `getSegments`), que sí tienen tipos.
- Los íconos cargan su fuente en forma asíncrona y llenaban la salida de advertencias `act(...)`. En un test de rutas el ícono no importa, así que lo reemplacé por un componente vacío.
- En el SDK 57 `renderRouter` es **sincrónico**. En el SDK 58 pasa a ser asíncrono (`await renderRouter(...)`), según la guía de migración.

**Qué podría preguntar el docente**

- *¿Por qué no probaste con `render(<NuevoReporte />)` directamente?* — Porque eso prueba el componente, no la ruta. `renderRouter` usa el mismo mapeo archivo → URL que la app real, que es lo que quiero verificar.
- *¿Qué es `getSegments()`?* — Los segmentos de archivo que coincidieron con la URL. Para `/reporte/42` es `['reporte', '[id]']`: demuestra que la URL cayó en la ruta dinámica y no en otra.
- *¿Qué es un mock?* — Un reemplazo falso de un módulo para el test. `jest.mock` hace que cualquier `import` de ese módulo reciba la versión falsa.

---

## M14 · Creé el tema y los componentes base

**Qué hice**

- `src/lib/tema.ts`: tokens de diseño (colores, espacios, radios y tipografía). Es un archivo sin React, por eso va en `lib`.
- Componentes base en `src/components`:
  - `Pantalla`: contenedor con fondo, márgenes y scroll (o sin scroll, para la cámara o listas).
  - `Texto`: variantes `titulo`, `subtitulo`, `cuerpo` y `secundario`. Los títulos se anuncian como encabezado (`accessibilityRole="header"`).
  - `Boton`: variantes `primario`, `secundario` y `peligro`, con estados deshabilitado y cargando. Alto mínimo de 48 px, rol `button` y etiqueta accesible.
  - `Campo`: etiqueta + `TextInput` + mensaje de error. Lo uso en el formulario de M17.
  - `Tarjeta` y `Enlace`.
- Pasé todas las pantallas provisorias a estos componentes y apliqué el color primario a encabezados y tabs.
- Tests de `Boton` (responde al toque, no responde deshabilitado ni cargando) y de `Campo`. Borré el test de inicio de M06 porque la pantalla ya la cubre el test de rutas.

**Por qué**

- Antes cada pantalla repetía el mismo `StyleSheet`. Con los componentes, cambiar el color primario o el margen se hace en un solo lugar.
- Los tokens van a facilitar el modo oscuro (M74): alcanza con tener un segundo juego de colores.
- La accesibilidad empieza acá: si `Boton` ya tiene rol, etiqueta y estado, todas las pantallas lo heredan. En la pantalla previa el botón "Continuar" va a ser un `Boton` primario.
- En los tests busco por rol y nombre (`getByRole('button', { name: 'Continuar' })`), igual que un lector de pantalla. Si el botón no fuera accesible, el test no lo encontraría.

**Qué podría preguntar el docente**

- *¿Por qué `Pressable` y no `TouchableOpacity`?* — `Pressable` es el componente actual de React Native para toques: da el estado `pressed` para el estilo y es más configurable. `TouchableOpacity` sigue existiendo pero se considera legado.
- *¿Por qué 48 px de alto mínimo?* — Es el área táctil mínima recomendada por Material Design (48 dp). Apple recomienda 44 pt. Con 48 se cumplen las dos.
- *¿Qué hace `accessibilityState={{ disabled, busy }}`?* — Le avisa al lector de pantalla (TalkBack o VoiceOver) que el botón está deshabilitado o procesando.

---

## M15 · Definí los tipos de reporte, categoría y estado

**Qué hice**

- `src/lib/reportes/tipos.ts` con:
  - `CATEGORIAS` (electricidad, agua, mobiliario, equipos) y el tipo `Categoria`.
  - `ESTADOS` (pendiente, en proceso, resuelto) y el tipo `Estado`.
  - El tipo `Reporte`: id, título, descripción, aula, categoría, estado y fecha de creación (ISO 8601).
  - Etiquetas para mostrar en pantalla (`ETIQUETA_CATEGORIA`, `ETIQUETA_ESTADO`) y la función `esCategoria`.
- Tests: las cuatro categorías, que todo tenga etiqueta y que `esCategoria` rechace valores inválidos.

**Por qué**

- Defino las categorías como un arreglo `as const` y saco el tipo de ahí (`(typeof CATEGORIAS)[number]`). Así hay **una sola fuente de verdad**: el arreglo sirve para dibujar los botones del formulario y el tipo para que TypeScript controle. Si agrego una categoría, TypeScript me obliga a ponerle etiqueta (`Record<Categoria, string>`).
- La fecha se guarda como texto ISO y no como `Date` porque después la voy a guardar en AsyncStorage (M64), que solo guarda texto.
- Todavía no agrego foto, ubicación ni sector: esos campos aparecen cuando llegan sus módulos. Así el modelo crece con la app.

**Qué podría preguntar el docente**

- *¿Qué hace `as const`?* — Hace que TypeScript tome el arreglo como de solo lectura y con los valores literales (`'agua'`), no como `string[]`. Sin eso no podría derivar el tipo `Categoria`.
- *¿Qué es `valor is Categoria`?* — Un *type guard*: si la función devuelve `true`, TypeScript sabe que a partir de ahí `valor` es una `Categoria`.
- *¿Por qué `en_proceso` con guion bajo?* — Es el valor interno (estable, sin espacios ni tildes). Lo que ve la persona sale de `ETIQUETA_ESTADO`: "En proceso".
