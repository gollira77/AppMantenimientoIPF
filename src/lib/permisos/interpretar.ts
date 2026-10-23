// Traduce la respuesta de cualquier módulo de Expo a los cuatro estados que entiende la interfaz.
// Sin React y sin importar ningún módulo de Expo: solo mira la forma de la respuesta.

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

/** Lo que tienen todas las PermissionResponse de Expo, más los matices opcionales de cada módulo. */
export type RespuestaPermiso = {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
  /** expo-image-picker / expo-media-library: 'all' | 'limited' | 'none'. */
  accessPrivileges?: string;
  /** expo-location en Android: 'fine' | 'coarse' | 'none'. */
  android?: { accuracy?: string };
  /** expo-location en iOS: 'full' | 'reduced'. */
  ios?: { accuracy?: string };
};

/**
 * - `null` / `undefined`: el hook todavía está consultando → cargando.
 * - `granted`: → concedido (aunque sea parcial).
 * - no concedido y `canAskAgain`: el sistema todavía puede mostrar el diálogo → preguntable.
 * - no concedido y sin `canAskAgain`: solo se cambia desde Ajustes → bloqueado.
 */
export function interpretarRespuesta(
  respuesta: RespuestaPermiso | null | undefined,
): EstadoPermiso {
  if (!respuesta) return 'cargando';
  if (respuesta.granted) return 'concedido';
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}

/**
 * Concedido, pero con menos alcance del pedido:
 * - fotos limitadas (`accessPrivileges: 'limited'`);
 * - ubicación aproximada en Android (`android.accuracy: 'coarse'`);
 * - ubicación aproximada en iOS (`ios.accuracy: 'reduced'`, interruptor "Precisa" apagado).
 */
export function esParcial(respuesta: RespuestaPermiso | null | undefined): boolean {
  if (!respuesta?.granted) return false;
  return (
    respuesta.accessPrivileges === 'limited' ||
    respuesta.android?.accuracy === 'coarse' ||
    respuesta.ios?.accuracy === 'reduced'
  );
}
