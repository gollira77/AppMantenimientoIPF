import AsyncStorage from '@react-native-async-storage/async-storage';
import type { z } from 'zod';

/**
 * Lee un valor guardado. Devuelve `null` si no hay nada o si no se puede usar: lo guardado
 * pudo quedar roto o con un formato viejo, y eso nunca tiene que impedir que la app abra.
 */
export async function leerGuardado<T>(clave: string, esquema: z.ZodType<T>): Promise<T | null> {
  try {
    const texto = await AsyncStorage.getItem(clave);
    if (texto === null) return null;
    const resultado = esquema.safeParse(JSON.parse(texto));
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}

/** Guardar es lo mejor que se puede hacer: si falla, la app sigue con lo que tiene en memoria. */
export async function escribirGuardado(clave: string, valor: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // No hay nada útil para mostrarle a la persona en este momento.
  }
}
