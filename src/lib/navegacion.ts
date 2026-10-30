import { router, type Href } from 'expo-router';

/**
 * Vuelve a la pantalla anterior. Si no hay ninguna (se abrió directo por URL, o se recargó
 * la página en web), va a `destino`: `router.back()` sin historial no hace nada.
 */
export function volver(destino: Href = '/'): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(destino);
  }
}
