import { ESTADOS, type Estado, type Reporte } from '@/lib/reportes/tipos';

/** Cuántos reportes hay en cada estado. */
export function contarPorEstado(reportes: Reporte[]): Record<Estado, number> {
  const cuentas = Object.fromEntries(ESTADOS.map((estado) => [estado, 0])) as Record<
    Estado,
    number
  >;
  for (const reporte of reportes) cuentas[reporte.estado] += 1;
  return cuentas;
}
