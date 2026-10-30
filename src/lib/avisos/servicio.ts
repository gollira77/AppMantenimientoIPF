import { programarAvisoResolucion } from '@/lib/notificaciones/programar';
import { interpretarRespuesta } from '@/lib/permisos/interpretar';
import { REGISTRO } from '@/lib/permisos/registro';
import type { Reporte } from '@/lib/reportes/tipos';

export type Aviso = {
  id: string;
  reporteId: string;
  mensaje: string;
  /** Fecha en formato ISO 8601. */
  creadoEn: string;
  leido: boolean;
};

export type Destino = 'notificacion' | 'bandeja';

export function crearAviso(reporte: Reporte, ahora: Date = new Date()): Aviso {
  return {
    id: `${reporte.id}-${ahora.getTime()}`,
    reporteId: reporte.id,
    mensaje: `"${reporte.titulo}" ya está resuelto.`,
    creadoEn: ahora.toISOString(),
    leido: false,
  };
}

type Opciones = {
  quiereAvisos: boolean;
  agregarABandeja: (aviso: Aviso) => void;
};

/**
 * Hace llegar el aviso de un reporte resuelto por el mejor camino disponible.
 * Si no se puede notificar, o algo falla, el aviso va a la bandeja: nunca se pierde.
 */
export async function avisarResolucion(
  reporte: Reporte,
  { quiereAvisos, agregarABandeja }: Opciones,
): Promise<Destino> {
  if (quiereAvisos) {
    try {
      // Consulto en este momento: el permiso pudo cambiar desde que se abrió la pantalla.
      const respuesta = await REGISTRO.notificaciones.consultar();
      if (interpretarRespuesta(respuesta) === 'concedido') {
        await programarAvisoResolucion(reporte);
        return 'notificacion';
      }
    } catch {
      // Sigue abajo: la bandeja es la alternativa.
    }
  }
  agregarABandeja(crearAviso(reporte));
  return 'bandeja';
}
