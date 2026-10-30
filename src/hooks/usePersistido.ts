import { useEffect, useState } from 'react';
import type { z } from 'zod';

import { escribirGuardado, leerGuardado } from '@/lib/persistencia/almacen';

/**
 * Recupera un valor guardado y lo mantiene guardado.
 * Espera a terminar de leer antes de escribir: si no, pisaría lo guardado con el valor inicial.
 */
export function usePersistido<T>(
  clave: string,
  esquema: z.ZodType<T>,
  valor: T,
  restaurar: (guardado: T) => void,
): void {
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    let vigente = true;
    leerGuardado(clave, esquema).then((guardado) => {
      if (!vigente) return;
      if (guardado !== null) restaurar(guardado);
      setCargado(true);
    });
    return () => {
      vigente = false;
    };
  }, [clave, esquema, restaurar]);

  useEffect(() => {
    if (cargado) void escribirGuardado(clave, valor);
  }, [clave, cargado, valor]);
}
