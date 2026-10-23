// Traduce la respuesta de cualquier módulo de Expo a los cuatro estados que entiende la interfaz.
// Sin React y sin importar ningún módulo de Expo: solo mira la forma de la respuesta.

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

/** Lo mínimo que tienen todas las PermissionResponse de Expo. */
export type RespuestaPermiso = {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
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
