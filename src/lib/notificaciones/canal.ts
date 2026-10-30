import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CANAL_REPORTES = 'reportes';

/**
 * En Android, cada notificación pertenece a un canal, y desde Android 13 el diálogo
 * del permiso no aparece hasta que exista al menos uno. iOS no tiene canales.
 */
export async function crearCanalReportes(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_REPORTES, {
    name: 'Reportes',
    description: 'Avisos cuando se resuelve un reporte tuyo.',
    importance: Notifications.AndroidImportance.HIGH,
  });
}
