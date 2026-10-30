import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import { registrarEnDiario, type Accion } from '@/lib/permisos/diario';
import { interpretarRespuesta, type RespuestaPermiso } from '@/lib/permisos/interpretar';
import { RECURSOS, type Recurso } from '@/lib/permisos/previa';

type EntradaRegistro = {
  /** Lee el permiso sin mostrar nada. */
  consultar: () => Promise<RespuestaPermiso>;
  /** Muestra el diálogo del sistema, si todavía se puede. */
  pedir: () => Promise<RespuestaPermiso>;
};

/** Todo lo que pasa por el registro queda anotado en el diario. */
async function conDiario(
  recurso: Recurso,
  accion: Accion,
  llamada: () => Promise<RespuestaPermiso>,
): Promise<RespuestaPermiso> {
  const respuesta = await llamada();
  registrarEnDiario(recurso, accion, interpretarRespuesta(respuesta));
  return respuesta;
}

// Cada recurso, con el módulo de Expo que le corresponde. Son funciones comunes, no hooks:
// se pueden llamar en un bucle, que es lo que necesita el panel de permisos.
export const REGISTRO: Record<Recurso, EntradaRegistro> = {
  camara: {
    consultar: () => conDiario('camara', 'consulta', () => Camera.getCameraPermissionsAsync()),
    pedir: () => conDiario('camara', 'pedido', () => Camera.requestCameraPermissionsAsync()),
  },
  ubicacion: {
    consultar: () =>
      conDiario('ubicacion', 'consulta', () => Location.getForegroundPermissionsAsync()),
    pedir: () =>
      conDiario('ubicacion', 'pedido', () => Location.requestForegroundPermissionsAsync()),
  },
};

/** Consulta todos los recursos a la vez. Nunca muestra un diálogo. */
export async function consultarTodos(): Promise<Record<Recurso, RespuestaPermiso>> {
  const respuestas = await Promise.all(RECURSOS.map((recurso) => REGISTRO[recurso].consultar()));
  return Object.fromEntries(RECURSOS.map((recurso, i) => [recurso, respuestas[i]])) as Record<
    Recurso,
    RespuestaPermiso
  >;
}
