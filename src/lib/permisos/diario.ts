import type { EstadoPermiso } from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';

export type Accion = 'consulta' | 'pedido';

export type EntradaDiario = {
  id: number;
  /** Fecha en formato ISO 8601. */
  hora: string;
  recurso: Recurso;
  accion: Accion;
  resultado: EstadoPermiso;
};

/** Alcanza para seguir lo último que pasó sin que el diario crezca para siempre. */
const MAXIMO = 30;

let entradas: readonly EntradaDiario[] = [];
let proximoId = 1;
const oyentes = new Set<() => void>();

export function registrarEnDiario(
  recurso: Recurso,
  accion: Accion,
  resultado: EstadoPermiso,
  ahora: Date = new Date(),
): void {
  const entrada = { id: proximoId, hora: ahora.toISOString(), recurso, accion, resultado };
  proximoId += 1;
  // El más nuevo primero. Creo una lista nueva para que React note el cambio.
  entradas = [entrada, ...entradas].slice(0, MAXIMO);
  oyentes.forEach((oyente) => oyente());
}

export function leerDiario(): readonly EntradaDiario[] {
  return entradas;
}

export function escucharDiario(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

export function vaciarDiario(): void {
  entradas = [];
  oyentes.forEach((oyente) => oyente());
}
