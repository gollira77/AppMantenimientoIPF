import type { Reporte } from '@/lib/reportes/tipos';

// Un id válido: letras, números y guiones, hasta 40 caracteres.
const PATRON_ID = /^[a-zA-Z0-9-]{1,40}$/;

export type ResultadoBusqueda =
  | { tipo: 'invalido' }
  | { tipo: 'no_encontrado'; id: string }
  | { tipo: 'encontrado'; reporte: Reporte };

/**
 * Valida el id que llega por la URL y busca el reporte.
 * El parámetro puede venir vacío, repetido (arreglo) o con cualquier texto si la URL se escribió a mano.
 */
export function buscarReporte(
  reportes: readonly Reporte[],
  idCrudo: string | string[] | undefined,
): ResultadoBusqueda {
  if (typeof idCrudo !== 'string' || !PATRON_ID.test(idCrudo)) {
    return { tipo: 'invalido' };
  }

  const reporte = reportes.find((r) => r.id === idCrudo);
  return reporte ? { tipo: 'encontrado', reporte } : { tipo: 'no_encontrado', id: idCrudo };
}
