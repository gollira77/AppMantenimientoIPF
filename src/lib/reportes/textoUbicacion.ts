import type { Ubicacion } from '@/lib/reportes/tipos';

/** Cómo se muestra una ubicación. Si es aproximada, nunca muestro las coordenadas. */
export function textoUbicacion(ubicacion: Ubicacion): string {
  if (ubicacion.aproximada) return 'Ubicación aproximada';
  return `${ubicacion.latitud.toFixed(5)}, ${ubicacion.longitud.toFixed(5)}`;
}
