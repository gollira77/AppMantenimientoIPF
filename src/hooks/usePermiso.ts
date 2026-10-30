import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import { escucharPermiso, publicarPermiso } from '@/lib/permisos/difusion';
import {
  esParcial,
  interpretarRespuesta,
  type EstadoPermiso,
  type RespuestaPermiso,
} from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';

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
  /** Concedido con menos alcance: ubicación aproximada o fotos limitadas. */
  parcial: boolean;
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
    publicarPermiso(recurso, nueva);
    return interpretarRespuesta(nueva);
  }, [recurso, funciones]);

  const pedir = useCallback(async () => {
    const nueva = await funciones.pedir();
    publicarPermiso(recurso, nueva);
    return interpretarRespuesta(nueva);
  }, [recurso, funciones]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  // Cada instancia se entera de lo que averigua cualquier otra del mismo recurso.
  useEffect(() => escucharPermiso(recurso, setRespuesta), [recurso]);

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

  // Los Ajustes del sistema están fuera de la app: nadie nos avisa si la persona cambió algo.
  // Al volver al primer plano, releo el permiso. Consultar no muestra ningún diálogo.
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') void consultar();
    });
    return () => suscripcion.remove();
  }, [consultar]);

  return {
    estado: interpretarRespuesta(respuesta),
    parcial: esParcial(respuesta),
    respuesta,
    pedir,
    consultar,
    abrirAjustes,
  };
}
