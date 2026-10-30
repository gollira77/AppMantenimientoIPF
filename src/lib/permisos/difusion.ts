import type { RespuestaPermiso } from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';

type Oyente = (respuesta: RespuestaPermiso) => void;

// Cada pantalla tiene su propia instancia de usePermiso. Cuando una se entera de una respuesta
// nueva (por ejemplo, el modal que pidió el permiso), se la cuenta a las demás del mismo recurso.
const oyentes = new Map<Recurso, Set<Oyente>>();

export function escucharPermiso(recurso: Recurso, oyente: Oyente): () => void {
  const delRecurso = oyentes.get(recurso) ?? new Set<Oyente>();
  oyentes.set(recurso, delRecurso);
  delRecurso.add(oyente);
  return () => {
    delRecurso.delete(oyente);
  };
}

export function publicarPermiso(recurso: Recurso, respuesta: RespuestaPermiso): void {
  oyentes.get(recurso)?.forEach((oyente) => oyente(respuesta));
}
