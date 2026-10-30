import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { escucharPermiso } from '@/lib/permisos/difusion';
import type { RespuestaPermiso } from '@/lib/permisos/interpretar';
import { RECURSOS, type Recurso } from '@/lib/permisos/previa';
import { consultarTodos } from '@/lib/permisos/registro';

type Respuestas = Partial<Record<Recurso, RespuestaPermiso>>;

/** El estado de todos los permisos. Se actualiza al entrar, al volver de Ajustes y al pedir. */
export function usePanelPermisos(): Respuestas {
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  const actualizar = useCallback(async () => {
    setRespuestas(await consultarTodos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void actualizar();
    }, [actualizar]),
  );

  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estadoApp) => {
      if (estadoApp === 'active') void actualizar();
    });
    return () => suscripcion.remove();
  }, [actualizar]);

  useEffect(() => {
    const bajas = RECURSOS.map((recurso) =>
      escucharPermiso(recurso, (respuesta) =>
        setRespuestas((actuales) => ({ ...actuales, [recurso]: respuesta })),
      ),
    );
    return () => bajas.forEach((baja) => baja());
  }, []);

  return respuestas;
}
