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
