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

---

## M16 · Mostré la lista de reportes con datos de prueba

**Qué hice**

- `src/lib/reportes/datosDePrueba.ts`: tres reportes de ejemplo, uno por estado.
- La tab Reportes guarda la lista en un **`useState`** y la muestra con `FlatList`.
- Componentes nuevos: `TarjetaReporte` (título, aula, categoría y estado; al tocarla abre `/reporte/<id>`) y `EtiquetaEstado` (pendiente en naranja, en proceso en azul, resuelto en verde).
- Botón "Nuevo reporte" que navega a `/reporte/nuevo`.
- Tests: se ven los reportes con su estado, tocar uno abre su detalle y el botón abre el formulario.

**Por qué**

- Arranco con datos falsos para construir y probar la interfaz sin depender del formulario ni del almacenamiento.
- Uso `useState` **a propósito**, como pide la consigna para esta versión. Ya sé que tiene un problema: el estado vive dentro de esta pantalla, así que cuando el formulario cree un reporte, la lista no se va a enterar. Ese problema aparece en M17 y lo resuelvo en M21 con un contexto.
- `FlatList` y no `ScrollView` con `map`: `FlatList` solo dibuja lo que se ve en pantalla. Con muchos reportes, la diferencia de rendimiento es grande.
- El estado no se comunica **solo con color**: la etiqueta tiene texto y el lector de pantalla lee "Estado: Pendiente". Así lo entiende alguien que no distingue colores.

**Qué podría preguntar el docente**

- *¿Para qué sirve `keyExtractor`?* — Le da a React una clave estable por fila (el id del reporte). Con eso, al agregar o quitar un reporte, React sabe qué fila cambió y no redibuja todas.
- *¿Por qué el `useState` no tiene `setReportes`?* — Porque en esta versión la lista no cambia: solo muestra los datos de prueba. Lo agrego cuando haga falta.
- *¿Esta pantalla pide algún permiso?* — No, y no debe pedirlo: es la pantalla de inicio. Pedir permisos al abrir la app es una mala práctica (Parte F1).

---

## M17 · Armé el formulario de nuevo reporte

**Qué hice**

- `/reporte/nuevo` tiene los cuatro campos de la consigna: título, descripción, aula y categoría.
- Cada campo es un `useState`. La categoría se elige con `SelectorCategoria`: cuatro opciones con rol `radio` (el lector de pantalla las anuncia como "botón de opción, marcado").
- "Guardar reporte" muestra un `Alert` y vuelve atrás.
- La pantalla **no pide ningún permiso al abrirse**, como exige la consigna. Agregué una línea que lo deja claro: "Ningún dato del celular es obligatorio para crear el reporte".
- Tests: aparecen los cuatro campos y la categoría elegida queda marcada.

**Por qué**

- Esta es la versión simple. Tiene dos problemas que dejo a la vista a propósito:
  1. **No valida nada**: se puede guardar un reporte vacío. Lo resuelvo en M18 con zod.
  2. **El reporte no llega a la lista**: la lista guarda sus datos en su propio `useState` (M16), y el formulario no tiene forma de llegar a ese estado. Lo resuelvo en M21 con un contexto.
- La categoría es un grupo de opciones y no un menú desplegable: con cuatro opciones se ven todas de un vistazo y se elige con un toque.
- `maxLength` en título y descripción evita textos enormes antes de llegar a la validación.

**Qué podría preguntar el docente**

- *¿Por qué el formulario no pide la cámara o la ubicación al abrirse?* — Porque la persona todavía no eligió usar esas funciones. Pedir antes de tiempo entrena el "No permitir" automático. El escáner, la foto y la ubicación son opcionales y se piden cuando se tocan.
- *¿Qué es un componente controlado?* — Un `TextInput` cuyo valor viene del estado (`value={titulo}`) y que avisa cada cambio (`onChangeText={setTitulo}`). La fuente de verdad es el estado de React, no el input.
- *¿Por qué `autoCapitalize="characters"` en el aula?* — Los códigos de aula van en mayúsculas ("B12"). Así el teclado ya sale en mayúsculas.

---

## M18 · Validé el formulario con zod

**Qué hice**

- Instalé `zod` (versión 4) con `npx expo install`.
- `src/lib/reportes/esquema.ts` define `esquemaReporte`:
  - **título:** de 3 a 60 letras;
  - **descripción:** de 10 a 500 letras;
  - **aula:** obligatoria, hasta 12 caracteres, se pasa a mayúsculas y solo admite letras, números y guiones (`B12`, `LAB-2`);
  - **categoría:** una de las cuatro de `CATEGORIAS`.
- La función `validarReporte` usa `safeParse` y devuelve `{ ok: true, datos }` o `{ ok: false, errores }` con **un mensaje por campo**.
- El formulario muestra cada error debajo de su campo (en rojo y con el borde rojo) y no guarda hasta que todo esté bien.

**Por qué**

- La validación vive en `lib` y no en la pantalla: es lógica pura, se puede testear sin renderizar nada (M19) y la reutilizo si el reporte llega por otro camino (por ejemplo, el aula leída del QR en M26).
- El esquema también **limpia** los datos: saca espacios (`trim`) y pasa el aula a mayúsculas. Lo que se guarda es `resultado.datos`, no lo que se tipeó.
- El tipo `DatosReporte` sale del esquema con `z.infer`: hay una sola definición para la validación y para TypeScript.
- Los mensajes dicen **cómo corregir** ("Usá letras, números y guiones, por ejemplo B12"), no solo "inválido".
- En zod 4 el mensaje se pasa con `{ error: '...' }` (en zod 3 era `{ message: '...' }`). Lo verifiqué en la versión instalada.

**Qué podría preguntar el docente**

- *¿Qué diferencia hay entre `parse` y `safeParse`?* — `parse` lanza una excepción si los datos no sirven. `safeParse` devuelve un objeto con `success`, así el error se maneja con un `if` y no con `try/catch`.
- *¿Por qué `entrada: unknown`?* — Porque la validación es justamente lo que convierte datos desconocidos en datos con tipo. Si recibiera `DatosReporte`, estaría asumiendo lo que quiero comprobar.
- *¿Por qué el mensaje del aula menciona el QR?* — Porque el aula se puede cargar escaneando el QR o, si se deniega la cámara, escribiéndola a mano. El mensaje recuerda las dos opciones.

---

## M19 · Cubrí los casos inválidos del formulario

**Qué hice**

- `src/__tests__/esquema.test.ts` prueba `validarReporte` sin renderizar nada:
  - un reporte válido se acepta y se **limpia** (espacios afuera, aula en mayúsculas);
  - el formulario vacío da un error en cada uno de los cuatro campos;
  - título corto, de solo espacios o de más de 60 letras;
  - descripción de menos de 10 o más de 500 letras;
  - aulas inválidas (`B 12`, `B12!`, `-B12`, `B12-`, `AULA/3`), vacía (el mensaje menciona el QR) o demasiado larga;
  - categoría `null`, vacía, inexistente (`gas`) o con mayúscula (`Agua`);
  - entradas que ni siquiera son objetos (`undefined`, un texto).
- En `formulario.test.tsx` agregué dos tests de pantalla:
  - guardar vacío muestra los mensajes;
  - con datos válidos, el reporte se guarda (se llama a `Alert.alert`) y la app vuelve a la lista.

**Por qué**

- La mayoría de los casos se prueban sobre la función pura porque es rápido y directo. En la pantalla pruebo lo que la función no puede saber: que los errores se **muestren** y que la navegación funcione.
- Con `it.each` escribo un caso por fila de una tabla: si agrego un formato de aula inválido nuevo, es una línea.
- El test de pantalla con datos válidos me mostró un detalle: `router.back()` necesita el router montado. Por eso ese test usa `renderRouter`, entra al formulario con el botón real "Nuevo reporte" y verifica que al guardar se vuelve a `/`.
- `jest.spyOn(Alert, 'alert')` reemplaza el cartel nativo, que en Jest no existe, y me deja comprobar con qué texto se llamó.

**Qué podría preguntar el docente**

- *¿Qué casos borde probaste?* — Textos con solo espacios (gracias a `trim` no pasan), aulas con espacios o símbolos, la categoría con mayúscula y entradas que no son objetos.
- *¿Por qué `'Agua'` es inválida si existe la categoría agua?* — Porque el valor interno es `agua`. La interfaz manda siempre el valor interno, así que un `Agua` indicaría un error en otra parte del código.
- *¿Qué es un spy?* — Un envoltorio sobre una función real que registra cómo se la llamó. Con `mockImplementation` además reemplazo lo que hace.

---

## M20 · Validé el id del detalle y mostré un mensaje si no existe

**Qué hice**

- `src/lib/reportes/buscar.ts` con `buscarReporte(reportes, idCrudo)`, que devuelve uno de tres resultados:
  - `invalido`: el id no es un texto o tiene caracteres raros (solo acepto letras, números y guiones, hasta 40);
  - `no_encontrado`: el id es válido pero no hay ningún reporte con ese número;
  - `encontrado`: el reporte.
- `/reporte/[id]` muestra un mensaje distinto para cada caso. Los dos casos de error tienen un enlace "Volver a mis reportes".
- Si el reporte existe, muestra título, estado, aula, categoría, fecha (con formato argentino) y descripción.
- Tests de la función (incluido un id repetido como arreglo, uno vacío y uno con `<script>`) y de la pantalla para los tres casos.

**Por qué**

- El id llega por la URL, y la URL la puede escribir cualquiera o venir de una notificación vieja (M62). No puedo confiar en ella: `useLocalSearchParams` puede devolver `undefined`, un texto cualquiera o un arreglo si el parámetro se repite.
- Separé "inválido" de "no existe" porque significan cosas distintas: uno es un enlace mal armado y el otro un reporte que ya no está. El mensaje ayuda a entender qué pasó.
- El resultado es una **unión discriminada** (`tipo`). TypeScript me obliga a manejar los tres casos y, dentro de cada `if`, sabe qué campos existen (`reporte` solo existe si `tipo === 'encontrado'`).
- La pantalla todavía busca en los datos de prueba. Un reporte nuevo del formulario no aparecería acá: es el mismo problema de M17, que resuelvo en el próximo módulo.

**Qué podría preguntar el docente**

- *¿Por qué no usar la página 404 para un reporte que no existe?* — Porque la ruta sí existe (`/reporte/[id]`); lo que no existe es el dato. La 404 es para URLs que no corresponden a ninguna pantalla.
- *¿Qué es una unión discriminada?* — Un tipo que es "uno de varios", con un campo común (`tipo`) que dice cuál es. Al chequear ese campo, TypeScript reduce el tipo automáticamente.
- *¿Por qué `Intl.DateTimeFormat('es-AR')`?* — Para mostrar la fecha como se lee en Argentina (día/mes/año) sin armar el texto a mano. Hermes, el motor de JavaScript de React Native, soporta `Intl`.

---

## M21 (evolución) · Moví los reportes a un contexto porque la lista no veía los nuevos

**El problema**

En M16 la lista guardaba los reportes en su propio `useState`. En M17 y M18 el formulario validaba y mostraba "Reporte creado", pero el reporte **no aparecía en la lista ni en el detalle**. No era un error de la lista ni del formulario: el estado de React es **local al componente** que lo crea. El formulario es otra pantalla y no tenía ninguna forma de llegar al `useState` de la lista. Para colmo, el detalle buscaba en los datos de prueba.

**Qué hice**

- `src/hooks/useReportes.tsx`:
  - `ProveedorReportes` guarda la lista en un único `useState` y expone `reportes` y `agregar(datos)`;
  - `useReportes()` la lee desde cualquier pantalla. Si se usa fuera del proveedor, tira un error claro en vez de devolver `undefined`.
- `src/lib/reportes/crear.ts`: `crearReporte` (id, estado `pendiente`, fecha ISO) y `generarId`. Son funciones puras, sin React.
- El proveedor envuelve el `Stack` en `src/app/_layout.tsx`, así todas las pantallas comparten los mismos datos.
- La lista, el detalle y el formulario ahora usan `useReportes()`.
- Tests: `crearReporte`, ids distintos, error fuera del proveedor, `agregar` pone el nuevo primero y el **flujo completo**: crear → aparece en la lista → el detalle se abre.

**Por qué este diseño lo resuelve**

- El estado sube al ancestro común de todas las pantallas (el layout raíz). Es la idea de "levantar el estado", pero con contexto: así no paso la lista por props a través del router, que no lo permite.
- `useMemo` y `useCallback` mantienen el mismo objeto `valor` mientras la lista no cambie, para que las pantallas no se redibujen de más.
- La lógica de armar un reporte quedó en `lib`, separada de React: el contexto solo decide **dónde vive** el estado.
- Todavía no persiste: si cierro la app se pierden los reportes nuevos. Eso es M64 (AsyncStorage detrás de un repositorio). Como las pantallas solo conocen `useReportes()`, ese cambio no las va a tocar.

**Qué podría preguntar el docente**

- *¿Por qué no Redux o Zustand?* — Para una lista y una función alcanza con Context de React, sin dependencias nuevas. Si el estado creciera mucho o cambiara muy seguido, evaluaría una librería.
- *¿Qué pasa si una pantalla usa `useReportes` fuera del proveedor?* — Tira el error "useReportes tiene que usarse dentro de &lt;ProveedorReportes&gt;". Así el problema aparece enseguida y no como un `undefined` misterioso.
- *¿Por qué `setReportes((actuales) => [nuevo, ...actuales])` y no `[nuevo, ...reportes]`?* — La forma con función usa siempre el estado más reciente, aunque se agreguen dos reportes seguidos antes de redibujar.

---

## M22 · Configuré el plugin de expo-camera sin micrófono

**Qué hice**

- Instalé `expo-camera` con `npx expo install` (quedó en `~57.0.6`).
- Agregué el plugin en `app.json`:

```json
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código QR del aula y sacar la foto del desperfecto que reportás.",
  "microphonePermission": false,
  "recordAudioAndroid": false,
  "barcodeScannerEnabled": true
}]
```

- Verifiqué el resultado sin compilar, con `npx expo config --type introspect`:
  - **iOS:** solo `NSCameraUsageDescription` con mi texto. **No** está `NSMicrophoneUsageDescription`.
  - **Android:** `CAMERA` sí, `RECORD_AUDIO` no.

**Por qué**

- El texto sigue el molde de la consigna, "Usamos tu [dato] para [beneficio concreto]", y nombra los **dos** usos reales de la cámara: el QR del aula y la foto del desperfecto (M44 reutiliza este permiso).
- `microphonePermission: false`: leí el código del plugin y, con `false`, borra la clave del `Info.plist` (si no paso nada, pone un texto genérico en inglés). Si la app no graba audio, no tiene por qué declarar el micrófono: Apple revisa que cada clave tenga un uso real.
- `recordAudioAndroid: false`: por defecto `expo-camera` agrega `RECORD_AUDIO` porque el mismo módulo graba video con sonido. Esta app solo lee QR, así que no lo necesita (mínimo privilegio, Parte F3).
- `barcodeScannerEnabled: true`: deja activo el lector de códigos que usa el escáner (M26).
- El introspect también mostró permisos que **yo no pedí** (`SYSTEM_ALERT_WINDOW`, `READ/WRITE_EXTERNAL_STORAGE`, `VIBRATE`): los agrega Expo por defecto. Los bloqueo y justifico en M45.

**Qué podría preguntar el docente**

- *¿Este cambio se puede publicar por OTA?* — No. Cambia el `Info.plist` y el `AndroidManifest.xml`, que son parte del binario. Necesita una build nueva.
- *¿Por qué en Expo Go no se ve mi texto?* — Porque Expo Go es otra app, con su propio `Info.plist` y sus propios textos. Mi texto aparece recién en una development build (M68).
- *¿Cómo verificaste el manifiesto sin compilar?* — Con `npx expo config --type introspect`, que corre los plugins y muestra cómo quedarían el `Info.plist` y el `AndroidManifest.xml`.

---

## M23 · Mostré la cámara en /reporte/escanear

**Qué hice**

- Versión **ingenua** del escáner, a propósito:

```tsx
const [permiso, pedirPermiso] = useCameraPermissions();
if (permiso?.granted) return <CameraView style={{ flex: 1 }} facing="back" />;
return (/* explicación + botón "Permitir" que llama a pedirPermiso */);
```

- Tests con `expo-camera` simulado: con el permiso concedido se ve la cámara; si no, el botón "Permitir" llama a `pedirPermiso`; con `null` no se rompe.
- Un mock global de `expo-camera` en `jest.setup.ts` (en Node no hay cámara), con el permiso en `null` por defecto.

**Por qué**

- La consigna pide arrancar por la versión simple para ver sus problemas. Esta versión es casi la del ejercicio E1, y tiene varios:
  1. **Primer render:** `useCameraPermissions` devuelve `null` mientras consulta. El código de E1 hace `permiso.status` y se rompe. Yo tuve que escribir `permiso?.granted` porque TypeScript estricto no me dejaba leer una propiedad de algo que puede ser `null`. Igual queda un problema: durante ese instante muestra la explicación y el botón "Permitir", aunque el permiso ya esté concedido (un parpadeo). Lo arreglo en M24.
  2. **No distingue "preguntable" de "bloqueado":** si la persona ya dijo que no y `canAskAgain` es `false`, tocar "Permitir" no hace nada (el sistema no muestra el diálogo). Lo arreglo en M25.
  3. **El botón dice "Permitir":** la pantalla previa tiene que decir "Continuar" (Parte F2). Lo arreglo en M25 y en M49.
  4. **No lee el QR** ni evita lecturas repetidas (M26) y **no hay salida si se deniega**: la persona queda trabada (M28).

**Qué podría preguntar el docente**

- *¿Qué devuelve `useCameraPermissions`?* — Un arreglo: `[permiso, pedir, consultar]`. `permiso` es `null` en el primer render y después un `PermissionResponse`. `pedir()` puede mostrar el diálogo; `consultar()` solo lee el estado.
- *¿Por qué esta versión "funciona la primera vez"?* — Porque en una instalación nueva el permiso está "sin decidir": al tocar "Permitir" aparece el diálogo y, si se acepta, se ve la cámara. Los problemas aparecen en los otros caminos: el primer render, un "no", o el bloqueo.
- *¿Por qué un mock global?* — Para que cualquier test que monte el router (como el de rutas) no intente usar la cámara real, y para controlar el estado del permiso desde cada test.

---

## M24 · Manejé el primer render donde el permiso todavía es null

**Qué hice**

- Si `permiso` es `null`, la pantalla muestra el componente nuevo `Cargando` ("Consultando el permiso de la cámara…") en lugar de la explicación con el botón.
- Después de ese `if`, TypeScript ya sabe que `permiso` no es `null`, así que saqué el `?.` de `permiso.granted`.
- Test nuevo: con `null` se ve el mensaje de carga y **no** aparece el botón "Permitir".

**Por qué**

- `useCameraPermissions` consulta al sistema de forma asíncrona. En el primer render todavía no tiene respuesta y devuelve `null`. "Todavía no sé" no es lo mismo que "no tengo permiso".
- En M23, ese instante se trataba como "no concedido": aparecían la explicación y el botón aunque la persona ya hubiera dado el permiso, y medio segundo después aparecía la cámara (un parpadeo). Peor: si tocaba el botón justo en ese momento, se pedía un permiso que ya estaba concedido.
- El mensaje de carga tiene `accessibilityLiveRegion="polite"` para que TalkBack lo anuncie sin interrumpir.
- Este es el primero de los cuatro estados que pide la consigna: **cargando**.

**Qué podría preguntar el docente**

- *¿Cuánto dura el `null`?* — Muy poco, normalmente un instante. Pero existe siempre, y en un celular lento se nota.
- *¿Por qué no guardar el permiso en un estado global para no consultar cada vez?* — Porque la persona lo puede cambiar en Ajustes en cualquier momento. La fuente de verdad es el sistema; la app tiene que volver a preguntarle (Parte E5c).
- *¿Qué hacía el código de E1 en este caso?* — `permiso.status` con `permiso` en `null`: error "Cannot read properties of null" y la pantalla roja.

---

## M25 · Separé los cuatro estados del permiso de cámara

**Qué hice**

El escáner ahora distingue los cuatro estados que pide la consigna:

| # | Estado | Condición | Qué muestra |
| --- | --- | --- | --- |
| 1 | Cargando | `permiso === null` | "Consultando el permiso de la cámara…" |
| 2 | Concedido | `permiso.granted` | La cámara |
| 3 | Preguntable | `!granted && canAskAgain` | Explicación del beneficio + aclaración de Ajustes + **"Continuar"** |
| 4 | Bloqueado | `!granted && !canAskAgain` | Cómo habilitarlo + **"Abrir Ajustes"** (`Linking.openSettings()`) |

- Tests de los cuatro estados. El 3 se prueba con "sin decidir" y con "denegado una vez" (los dos tienen `canAskAgain: true`).
- En el estado bloqueado, el test verifica que **no** se llama a `pedirPermiso`.

**Por qué**

- `granted` solo responde "¿lo tengo?". Para saber qué hacer cuando no lo tengo hace falta `canAskAgain`: "¿el sistema todavía puede mostrar el diálogo?" (Parte D3: son los dos campos que deciden casi todo).
- En la versión de M23, si el permiso estaba bloqueado, tocar "Permitir" llamaba a `request…()`, el sistema contestaba "no" sin mostrar nada y la persona sentía que el botón no andaba. Ahora el botón la lleva a Ajustes, que es el único lugar donde se puede cambiar.
- El botón dice **"Continuar"** y no "Permitir": quien concede el permiso es el sistema, en su diálogo. Si mi botón dijera "Permitir", la persona creería que ya aceptó y el diálogo la confundiría.
- La explicación sigue el molde "Usamos tu cámara para…" y aclara que se puede cambiar en Ajustes, sin botón de "Ahora no" (pauta 5.1.1(iv) de Apple).

**Qué podría preguntar el docente**

- *¿Cuándo pasa un permiso de "preguntable" a "bloqueado"?* — En iOS, después del primer "No permitir". En Android 11+, después del segundo. En los dos casos `canAskAgain` pasa a `false`.
- *¿Qué hace `Linking.openSettings()`?* — Abre la pantalla de Ajustes de **esta app** en el sistema, donde están sus permisos.
- *¿Qué pasa cuando la persona vuelve de Ajustes?* — En esta versión, nada: el hook no se entera de que el permiso cambió y la pantalla sigue diciendo "bloqueado". Lo arreglo en M47 con `AppState`.

---

## M26 · Leí el QR del aula y evité lecturas repetidas

**Qué hice**

- Definí el formato de los QR pegados en cada aula: el texto `IPF-AULA:<código>`, por ejemplo `IPF-AULA:B12`.
- `src/lib/aulas/codigoQr.ts`:
  - `leerCodigoAula(datos)` devuelve `{ tipo: 'aula', aula }` o `{ tipo: 'ajeno' }` (cualquier QR que no sea de un aula del IPF);
  - `codigoQrDeAula(aula)` arma el texto inverso, para el generador de QR (M30).
- En el escáner:
  - `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}`: solo busca QR, no códigos de barras de productos;
  - `onBarcodeScanned` guarda la lectura y muestra "Aula B12" o "Ese QR no es de un aula", con un botón "Escanear otra vez";
  - **una sola lectura**: un `useRef` corta en la primera, y además paso `onBarcodeScanned={undefined}` cuando ya hay lectura.
- Tests con una cámara simulada que dispara lecturas: muestra el aula, procesa **una sola** lectura aunque lleguen tres seguidas, y avisa con un QR ajeno.

**Por qué**

- Mientras el QR está enfocado, la cámara llama a `onBarcodeScanned` **muchas veces por segundo**. Si solo usara `useState`, varias llamadas podrían llegar antes de que React vuelva a dibujar y procesaría la misma lectura varias veces (por ejemplo, navegar dos veces). El `ref` cambia en el momento, sin esperar al render.
- Pasar `undefined` además le dice a la cámara que deje de analizar cuadros, lo que ahorra batería.
- El prefijo `IPF-AULA:` evita que un QR cualquiera (un menú, una publicidad) se tome como aula. Y reutilizo `PATRON_AULA` del esquema de zod: un aula leída del QR cumple las mismas reglas que una escrita a mano.
- Todavía el aula leída **no llega al formulario**: el escáner es otra pantalla y no tiene cómo escribir en él. Lo resuelvo en M29.

**Qué podría preguntar el docente**

- *¿Por qué `useRef` y no `useState` para el "ya leído"?* — Cambiar un `ref` no redibuja y el valor nuevo está disponible al instante, incluso dentro de la misma ráfaga de eventos. `useState` recién se actualiza en el próximo render.
- *¿Qué datos trae `onBarcodeScanned`?* — Un `BarcodeScanningResult` con `data` (el texto del QR), `type` (`'qr'`), los bordes y las esquinas del código.
- *¿El escáner necesita permiso de galería o de internet?* — No. Solo la cámara: lee el QR en el momento, en el dispositivo.

---

## M27 · Probé el parser de códigos de aula

**Qué hice**

- `src/__tests__/codigoQr.test.ts`, con 21 casos:
  - **QR válidos:** `IPF-AULA:B12`, `LAB-2`, `PB-BAÑO`, en minúsculas, con espacios alrededor y con espacios después de los dos puntos. Todos se leen como el aula en mayúsculas.
  - **QR ajenos:** vacío, una URL, otro prefijo, el prefijo solo o con espacios, espacio en el medio del código, símbolos (`B12;DROP`), guion al final, código de más de 12 caracteres y el prefijo en el medio del texto.
  - **Ida y vuelta:** el QR que arma `codigoQrDeAula` se lee como la misma aula. Esto asegura que el generador (M30) y el escáner hablen el mismo formato.

**Por qué**

- El parser recibe **datos de afuera**: cualquier QR que alguien ponga delante de la cámara. Es el punto donde más importa probar los casos raros.
- Como es una función pura en `lib`, se prueba en milisegundos y sin simular la cámara. El test de pantalla de M26 solo verifica que la pantalla **use** el parser; los casos de borde están acá.
- El test de ida y vuelta es el más valioso: si mañana cambio el prefijo en un solo lado, falla.

**Qué podría preguntar el docente**

- *¿Por qué `B12;DROP` es un caso?* — Representa un QR malicioso o mal armado. El código del aula termina en un formulario y, más adelante, en el almacenamiento: no tiene que entrar nada fuera del formato.
- *¿Qué diferencia hay entre estos tests y los del escáner?* — Estos son **unitarios** (una función, sin interfaz). Los del escáner son de **componente**: verifican la pantalla con la cámara simulada.
- *¿Por qué aceptar minúsculas?* — Si alguien imprime el QR con un generador externo en minúsculas, igual tiene que funcionar. Normalizo a mayúsculas, como hace el esquema de zod.

---

## M28 · Permití cargar el aula a mano si se deniega la cámara

**Qué hice**

- Componente `IngresoAulaManual`: un campo "Código del aula" y un botón "Usar esta aula". Valida con `esquemaReporte.shape.aula`, **la misma regla** que el formulario y que el QR.
- En el escáner, la carga manual aparece en dos casos:
  - **Se acaba de denegar** (la persona tocó "Continuar" y en el diálogo eligió "No permitir"): la pantalla pasa directo a "Escribí el código del aula" y **no** vuelve a mostrar la explicación.
  - **Bloqueado**: muestra "Abrir Ajustes" (ahora como botón secundario) y, debajo, la carga manual.
- "Continuar" ahora espera la respuesta de `pedirPermiso()` para saber si la persona dijo que no.
- El resultado (leído o escrito) se muestra igual: "Aula LAB-2". "Escanear otra vez" solo aparece si hay cámara.
- Tests: después de un "no" se ofrece la carga manual sin "Continuar"; con la cámara bloqueada se puede escribir `lab-2` y queda `LAB-2`; un aula inválida muestra el error del esquema.

**Por qué**

- La regla 7 de la consigna: **ningún permiso denegado impide crear un reporte**. Antes de este módulo, sin cámara la persona quedaba trabada en el escáner.
- Después de un "no" no vuelvo a mostrar la explicación con "Continuar": eso sería insistir (regla 8). Si la persona quiere usar la cámara, vuelve a tocar la función.
- No puse la opción "escribir a mano" **en la explicación previa** al diálogo. La pauta 5.1.1(iv) de Apple no permite una salida que evite la pregunta en esa pantalla. Recién después de la respuesta del sistema ofrezco la alternativa.
- Valido con `esquemaReporte.shape.aula`: un solo lugar define qué es un aula válida, la escriba o la escanee.

**Qué podría preguntar el docente**

- *¿Qué devuelve `pedirPermiso()`?* — Una promesa con el `PermissionResponse` nuevo. Con eso sé si la persona aceptó o no sin esperar al próximo render del hook.
- *¿Qué es `esquemaReporte.shape.aula`?* — El esquema de zod de un solo campo dentro del objeto. Me deja validar el aula sola con las mismas reglas.
- *¿Y si la persona no sabe el código del aula?* — Está escrito en el QR pegado en la puerta, debajo del código (lo muestra el generador de M30).

---

## M29 (evolución) · Creé un borrador compartido para que el escáner complete el aula

**El problema**

Después de M26 y M28 el escáner leía el aula (o la recibía escrita), pero mostraba "Aula B12" y ahí terminaba: el dato **no llegaba al formulario**. Otra vez el estado local: el formulario guardaba título, descripción, aula y categoría en cuatro `useState` propios, y el escáner, al ser otra pantalla, no tenía forma de escribir en ellos. Pasar el aula como parámetro de la URL al volver tampoco servía: `router.back()` no lleva parámetros y, con `push`, quedaba un formulario nuevo encima del viejo, perdiendo lo escrito.

**Qué hice**

- `src/lib/reportes/borrador.ts`: el tipo `Borrador` (lo cargado, todavía sin validar) y `BORRADOR_VACIO`.
- `src/hooks/useBorrador.tsx`: `ProveedorBorrador` con `borrador`, `actualizar(cambios)` y `limpiar()`. Va en el layout raíz, al lado de `ProveedorReportes`.
- El formulario lee y escribe **todo** en el borrador (ya no tiene `useState` por campo, salvo los errores). Botón nuevo "Escanear QR del aula".
- El escáner, con un aula válida (leída o escrita), hace `actualizar({ aula })` y vuelve con `router.back()`. Si se abrió directo por URL y no hay a dónde volver, abre `/reporte/nuevo`. Solo un QR ajeno se queda en pantalla con "Escanear otra vez".
- Al guardar el reporte, el formulario llama a `limpiar()`.
- `src/test-utils/Proveedores.tsx` envuelve una pantalla suelta con los dos proveedores en los tests.
- Test de integración: escribo el título → "Escanear QR del aula" → leo `IPF-AULA:B12` → vuelvo al formulario con el aula `B12` **y el título intacto**.

**Por qué este diseño lo resuelve**

- El borrador vive arriba de las dos pantallas, así que las dos lo leen y lo modifican. Es el mismo patrón de M21, aplicado a otro dato.
- Separé el borrador de los reportes: un reporte es algo ya validado y guardado; el borrador puede estar a medias o mal. Mezclarlos me obligaría a validar en todos lados.
- Además, ahora el formulario **no pierde lo escrito** si la persona va al escáner, a la foto o a la ubicación (M43 y M40 usan el mismo borrador).

**Qué podría preguntar el docente**

- *¿Por qué no pasar el aula por parámetro con `router.push('/reporte/nuevo?aula=B12')`?* — Porque crearía otra pantalla de formulario encima de la anterior: la persona tendría dos formularios en el historial y perdería lo que ya había escrito.
- *¿Qué pasa con el borrador si cierro la app?* — Por ahora se pierde. En M65 lo persisto con AsyncStorage.
- *¿Por qué `actualizar` recibe un `Partial<Borrador>`?* — Para cambiar un solo campo (`{ aula: 'B12' }`) sin tener que pasar los demás.

---

## M30 · Agregué un generador de QR por aula para probar el escáner

**Qué hice**

- Instalé `react-native-svg` y `react-native-qrcode-svg` con `npx expo install`. `react-native-svg` viene incluido en Expo Go, así que no hace falta una build nueva.
- `/herramientas/qr`:
  - botones con las aulas frecuentes (`A1`, `B12`, `LAB-2`, `PB-BAÑO`…) y un campo para escribir cualquier otra;
  - el aula se valida con `esquemaReporte.shape.aula`, la misma regla de siempre;
  - muestra el QR (con `codigoQrDeAula`, que arma `IPF-AULA:<aula>`), el aula en grande y el texto exacto del código.
- Enlace "Generador de QR de aulas" en la tab Reportes.
- En los tests, el QR se reemplaza por un texto `qr:<contenido>` (mock en `jest.setup.tsx`, que renombré de `.ts` porque ahora tiene JSX).
- Tests: aula inicial, cambio de aula, aula escrita a mano en minúsculas, aula inválida sin QR y **el QR generado lo entiende el escáner**.
- Verifiqué `expo-doctor` (21/21) y el bundle de Android.

**Por qué**

- Para probar el escáner necesito QR reales con el formato `IPF-AULA:`. Con esta herramienta abro el generador en un celular (o en la compu con `npx expo start --web`) y escaneo con el otro.
- Uso la misma función `codigoQrDeAula` que el parser de M27 conoce. El último test cierra el círculo: lo que genera el generador, lo lee el escáner.
- El texto del aula va **debajo** del QR: es lo que la persona copia si no tiene cámara (carga manual de M28).
- Esta pantalla no pide **ningún** permiso: generar y mostrar un QR no toca datos del celular.

**Qué podría preguntar el docente**

- *¿Por qué `react-native-qrcode-svg` y no un servicio web que devuelva la imagen?* — Porque funciona sin internet y no manda datos a terceros. Además el SVG se ve nítido en cualquier tamaño.
- *¿Hace falta una development build por `react-native-svg`?* — No: Expo Go ya incluye ese módulo nativo. Lo que no está en Expo Go sí obliga a una build.
- *¿Cómo es accesible un QR?* — El contenedor tiene `accessibilityRole="image"` y la etiqueta "Código QR del aula B12". Además el código se muestra como texto.

---

## M31 · Respondí la Parte B y E1 comparando con mi primer escáner

**Qué hice**

- En `RESPUESTAS.md` escribí:
  - **B1:** la clasificación de los diez permisos (instalación, tiempo de ejecución o especial) y cómo se obtiene cada uno.
  - **B2:** grupos de permisos, el prefijo `android.permission.` y los permisos de firma.
  - **B4:** el diálogo de Android, "Solo esta vez", los dos rechazos, la ubicación aproximada y qué pasa al revocar un permiso.
  - **B5:** la tabla de versiones, `targetSdkVersion` y el requisito de Google Play.
  - **E1:** los siete problemas del código de la consigna y la versión corregida con los cuatro estados.
- B3 queda para M70, como indica la consigna, porque se responde con el manifiesto real de la build.

**Por qué**

- Respondo E1 comparando con **mi** escáner de M23 porque cometí casi los mismos errores y los fui corrigiendo uno por uno (M24, M25, M26, M28). Es la mejor forma de explicarlos en el oral: los viví en el código.
- Los números de versión los verifiqué en fuentes oficiales y en el proyecto:
  - **SDK 57:** apunta a API 36 (`targetSdk = 36`, `compileSdk = 36`, `minSdk = 24`), según `node_modules/react-native/gradle/libs.versions.toml` y `expo-modules-core`. El mínimo de iOS es 16.4 (podspecs de Expo).
  - **Google Play:** desde el 31/08/2026 exige API 36 para apps nuevas y actualizaciones (página oficial de requisitos de nivel de API).
  - **Android 17 (API 37):** suma el permiso `ACCESS_LOCAL_NETWORK` (página oficial "Local network permission").

**Qué podría preguntar el docente**

- *¿Qué diferencia hay entre un permiso especial y uno de tiempo de ejecución?* — El de tiempo de ejecución se concede en un diálogo dentro de la app. El especial no tiene diálogo: la app manda a la persona a una pantalla específica de Ajustes y ahí lo habilita.
- *¿Por qué tu app no declara `SYSTEM_ALERT_WINDOW` si aparece en el manifiesto de Expo?* — Lo agrega Expo por defecto (para herramientas de desarrollo). La app no lo usa, así que lo bloqueo con `blockedPermissions` en M45.
- *¿Tu app cumple el requisito de Google Play de agosto de 2026?* — Sí: Expo SDK 57 compila con `targetSdkVersion` 36.
