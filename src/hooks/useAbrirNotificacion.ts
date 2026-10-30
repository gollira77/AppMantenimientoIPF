import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

/** Al tocar una notificación, abre su reporte. También si la app estaba cerrada. */
export function useAbrirNotificacion(): void {
  const respuesta = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (respuesta?.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const reporteId = respuesta.notification.request.content.data?.reporteId;
    if (typeof reporteId !== 'string') return;
    router.push(`/reporte/${reporteId}`);
    // El sistema la recuerda: sin esto, recargar la app volvería a abrir el reporte.
    void Notifications.clearLastNotificationResponseAsync();
  }, [respuesta]);
}
