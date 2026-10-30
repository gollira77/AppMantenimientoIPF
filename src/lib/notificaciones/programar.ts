import * as Notifications from 'expo-notifications';

import { CANAL_REPORTES } from '@/lib/notificaciones/canal';
import { SEGUNDOS_AVISO } from '@/lib/notificaciones/constantes';
import type { Reporte } from '@/lib/reportes/tipos';

export { SEGUNDOS_AVISO };

/** Sin esto, una notificación que llega con la app abierta no se muestra. */
export function configurarNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Programa la notificación local. La dispara el sistema, aunque la app esté cerrada. */
export function programarAvisoResolucion(reporte: Reporte): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reporte resuelto',
      body: `"${reporte.titulo}" ya está resuelto.`,
      data: { reporteId: reporte.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_AVISO,
      channelId: CANAL_REPORTES,
    },
  });
}
