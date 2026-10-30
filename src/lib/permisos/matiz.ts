import type { EstadoPermiso, RespuestaPermiso } from '@/lib/permisos/interpretar';

export const ETIQUETA_PERMISO: Record<EstadoPermiso, string> = {
  cargando: 'Consultando…',
  concedido: 'Concedido',
  preguntable: 'Sin decidir',
  bloqueado: 'Bloqueado',
};

/** El detalle de la respuesta que no entra en los cuatro estados. `null` si no hay ninguno. */
export function textoMatiz(respuesta: RespuestaPermiso | null | undefined): string | null {
  if (!respuesta) return null;
  const partes: string[] = [];
  const accuracy = respuesta.android?.accuracy ?? respuesta.ios?.accuracy;
  if (accuracy) partes.push(`accuracy: ${accuracy}`);
  if (respuesta.accessPrivileges) partes.push(`accessPrivileges: ${respuesta.accessPrivileges}`);
  return partes.length > 0 ? partes.join(' · ') : null;
}
