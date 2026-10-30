import type { DatosReporte } from '@/lib/reportes/esquema';
import type { Reporte } from '@/lib/reportes/tipos';

/** Id corto y único en el dispositivo: tiempo en base 36 más un sufijo al azar. */
export function generarId(ahora: Date = new Date(), azar: () => number = Math.random): string {
  const sufijo = Math.floor(azar() * 36 ** 4)
    .toString(36)
    .padStart(4, '0');
  return `${ahora.getTime().toString(36)}-${sufijo}`;
}

/** Arma un reporte nuevo a partir de los datos ya validados. Siempre arranca pendiente. */
export function crearReporte(datos: DatosReporte, ahora: Date = new Date()): Reporte {
  return {
    ...datos,
    id: generarId(ahora),
    estado: 'pendiente',
    creadoEn: ahora.toISOString(),
  };
}
