import { useSyncExternalStore } from 'react';

import { escucharDiario, leerDiario } from '@/lib/permisos/diario';

/** El diario vive fuera de React: useSyncExternalStore redibuja cuando cambia. */
export function useDiario() {
  return useSyncExternalStore(escucharDiario, leerDiario);
}
