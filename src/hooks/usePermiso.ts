import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import {
  interpretarRespuesta,
  type EstadoPermiso,
  type RespuestaPermiso,
} from '@/lib/permisos/interpretar';

export type Recurso = 'camara' | 'ubicacion';

type Funciones = {
  consultar: () => Promise<RespuestaPermiso>;
  pedir: () => Promise<RespuestaPermiso>;
};

// Cómo se consulta y se pide cada recurso con su módulo de Expo.
const FUNCIONES: Record<Recurso, Funciones> = {
  camara: {
    consultar: () => Camera.getCameraPermissionsAsync(),
    pedir: () => Camera.requestCameraPermissionsAsync(),
  },
  ubicacion: {
    consultar: () => Location.getForegroundPermissionsAsync(),
    pedir: () => Location.requestForegroundPermissionsAsync(),
  },
};

export type ResultadoPermiso = {
  estado: EstadoPermiso;
  /** La respuesta cruda del sistema, para quien necesite los detalles. */
  respuesta: RespuestaPermiso | null;
  /** Muestra el diálogo del sistema (si todavía se puede) y devuelve el estado nuevo. */
  pedir: () => Promise<EstadoPermiso>;
  /** Vuelve a leer el permiso sin mostrar nada. */
  consultar: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
};

export function usePermiso(recurso: Recurso): ResultadoPermiso {
  const [respuesta, setRespuesta] = useState<RespuestaPermiso | null>(null);
  const funciones = FUNCIONES[recurso];

  const consultar = useCallback(async () => {
    const nueva = await funciones.consultar();
    setRespuesta(nueva);
    return interpretarRespuesta(nueva);
  }, [funciones]);

  const pedir = useCallback(async () => {
    const nueva = await funciones.pedir();
    setRespuesta(nueva);
    return interpretarRespuesta(nueva);
  }, [funciones]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  // Al montar, solo consulto: nunca muestro un diálogo sin que la persona lo pida.
  useEffect(() => {
    let vigente = true;
    funciones.consultar().then((inicial) => {
      if (vigente) setRespuesta(inicial);
    });
    return () => {
      vigente = false;
    };
  }, [funciones]);

  return { estado: interpretarRespuesta(respuesta), respuesta, pedir, consultar, abrirAjustes };
}
