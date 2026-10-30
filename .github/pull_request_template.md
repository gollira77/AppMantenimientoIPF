## Qué cambia

<!-- Una o dos frases: qué hace este PR y qué módulo(s) cubre (por ejemplo, M23–M28). -->

## Por qué

<!-- Qué problema resuelve. Si es una evolución (refactor), qué falló en el diseño anterior. -->

## Permisos afectados

- [ ] No toca permisos
- [ ] Cámara
- [ ] Ubicación (solo primer plano)
- [ ] Fotos (selector del sistema, sin permiso de galería)
- [ ] Notificaciones
- [ ] Micrófono
- [ ] Cambia `app.json` (plugins, textos de propósito o `blockedPermissions`) → necesita una build nueva, no alcanza con OTA

## Cómo lo probé

- [ ] `npx tsc --noEmit`
- [ ] `npx expo lint`
- [ ] `npm test`
- [ ] Android (Expo Go o development build): <!-- pasos -->
- [ ] iOS (Expo Go o development build): <!-- pasos -->

## Checklist

- [ ] Los commits siguen `tipo(ámbito): mensaje en primera persona y en pasado`
- [ ] Ningún permiso denegado impide crear un reporte
- [ ] Antes de cada diálogo del sistema hay una pantalla previa con un único botón "Continuar"
- [ ] Agregué la entrada en `docs/bitacora.md`
