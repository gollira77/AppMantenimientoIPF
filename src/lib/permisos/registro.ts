import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import type { RespuestaPermiso } from '@/lib/permisos/interpretar';
import { RECURSOS, type Recurso } from '@/lib/permisos/previa';

type EntradaRegistro = {
  /** Lee el permiso sin mostrar nada. */
  consultar: () => Promise<RespuestaPermiso>;
  /** Muestra el diálogo del sistema, si todavía se puede. */
  pedir: () => Promise<RespuestaPermiso>;
};

// Cada recurso, con el módulo de Expo que le corresponde. Son funciones comunes, no hooks:
// se pueden llamar en un bucle, que es lo que necesita el panel de permisos.
export const REGISTRO: Record<Recurso, EntradaRegistro> = {
  camara: {
    consultar: () => Camera.getCameraPermissionsAsync(),
    pedir: () => Camera.requestCameraPermissionsAsync(),
  },
  ubicacion: {
    consultar: () => Location.getForegroundPermissionsAsync(),
    pedir: () => Location.requestForegroundPermissionsAsync(),
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
