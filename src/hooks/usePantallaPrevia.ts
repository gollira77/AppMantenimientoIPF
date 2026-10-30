import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import type { EstadoPermiso } from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';

/** Abre la pantalla previa cuando se llega a una función con el permiso sin decidir. */
export function usePantallaPrevia(recurso: Recurso, estado: EstadoPermiso) {
  const abrir = useCallback(() => router.push(`/permisos/${recurso}`), [recurso]);

  useFocusEffect(
    useCallback(() => {
      if (estado === 'preguntable') abrir();
    }, [estado, abrir]),
  );

  return abrir;
}
