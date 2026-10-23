import { PATRON_AULA } from '@/lib/reportes/esquema';

// Contenido de los QR pegados en cada aula: "IPF-AULA:B12".
export const PREFIJO_QR = 'IPF-AULA:';

export type LecturaQr = { tipo: 'aula'; aula: string } | { tipo: 'ajeno' };

/** Arma el texto que va dentro del QR de un aula. */
export function codigoQrDeAula(aula: string): string {
  return `${PREFIJO_QR}${aula.trim().toUpperCase()}`;
}

/** Interpreta lo que leyó la cámara. Cualquier QR que no sea de un aula del IPF es "ajeno". */
export function leerCodigoAula(datos: string): LecturaQr {
  const limpio = datos.trim();
  if (!limpio.toUpperCase().startsWith(PREFIJO_QR)) {
    return { tipo: 'ajeno' };
  }

  const aula = limpio.slice(PREFIJO_QR.length).trim().toUpperCase();
  if (aula.length === 0 || aula.length > 12 || !PATRON_AULA.test(aula)) {
    return { tipo: 'ajeno' };
  }
  return { tipo: 'aula', aula };
}
