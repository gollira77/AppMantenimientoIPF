import { router } from 'expo-router';

import { SEGUNDOS_AVISO } from '@/lib/notificaciones/constantes';
import type { Reporte } from '@/lib/reportes/tipos';

export { SEGUNDOS_AVISO };

/** En web no hay nada que configurar: la notificación la muestra el navegador. */
export function configurarNotificaciones(): void {}

/** expo-notifications no programa notificaciones en web: uso la API del navegador. */
export async function programarAvisoResolucion(reporte: Reporte): Promise<string> {
  setTimeout(() => {
    const aviso = new Notification('Reporte resuelto', {
      body: `"${reporte.titulo}" ya está resuelto.`,
    });
    aviso.onclick = () => {
      window.focus();
      router.push(`/reporte/${reporte.id}`);
    };
  }, SEGUNDOS_AVISO * 1000);
  return reporte.id;
}
