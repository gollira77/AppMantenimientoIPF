import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

import type { EstadoPermiso } from '@/lib/permisos/interpretar';
import type { Recurso } from '@/lib/permisos/previa';

/**
 * Abre la pantalla previa cuando se llega a una función con el permiso sin decidir.
 * Sola se abre una vez por visita: después de un "no", vuelve a aparecer únicamente
 * si la persona toca otra vez la función (el `abrir` que devuelve este hook).
 */
export function usePantallaPrevia(recurso: Recurso, estado: EstadoPermiso) {
  const yaSeMostro = useRef(false);

  const abrir = useCallback(() => {
    yaSeMostro.current = true;
    router.push(`/permisos/${recurso}`);
  }, [recurso]);

  useFocusEffect(
    useCallback(() => {
      if (estado === 'preguntable' && !yaSeMostro.current) abrir();
    }, [estado, abrir]),
  );

  return abrir;
}
