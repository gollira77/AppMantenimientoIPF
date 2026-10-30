import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';

import { escucharPermiso, publicarPermiso } from '@/lib/permisos/difusion';
import {
  esParcial,
  interpretarRespuesta,
  type EstadoPermiso,
  type RespuestaPermiso,
} from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';
import { REGISTRO } from '@/lib/permisos/registro';

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

const AVISO_AJUSTES_WEB =
  'En el navegador, los permisos se cambian desde el ícono que está junto a la dirección de la página.';

export function usePermiso(recurso: Recurso): ResultadoPermiso {
  const [respuesta, setRespuesta] = useState<RespuestaPermiso | null>(null);
  const funciones = REGISTRO[recurso];

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

  const abrirAjustes = useCallback(async () => {
    // El navegador no tiene una pantalla de Ajustes que se pueda abrir desde el código.
    if (Platform.OS === 'web') {
      globalThis.alert?.(AVISO_AJUSTES_WEB);
      return;
    }
    await Linking.openSettings();
  }, []);

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
