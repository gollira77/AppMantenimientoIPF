import { z } from 'zod';

import { CATEGORIAS } from '@/lib/reportes/tipos';

// Formato de aula: letras, números y guiones, como "B12", "LAB-2" o "PB-BAÑO".
export const PATRON_AULA = /^[A-ZÑ0-9]+(-[A-ZÑ0-9]+)*$/;

export const esquemaReporte = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, { error: 'El título tiene que tener al menos 3 letras.' })
    .max(60, { error: 'El título puede tener hasta 60 letras.' }),
  descripcion: z
    .string()
    .trim()
    .min(10, { error: 'Contá un poco más: al menos 10 letras.' })
    .max(500, { error: 'La descripción puede tener hasta 500 letras.' }),
  aula: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, { error: 'Indicá el aula (escaneá el QR o escribila).' })
    .max(12, { error: 'El código de aula es demasiado largo.' })
    .regex(PATRON_AULA, { error: 'Usá letras, números y guiones, por ejemplo B12.' }),
  categoria: z.enum(CATEGORIAS, { error: 'Elegí una categoría.' }),
  // Opcional: un permiso denegado nunca impide crear el reporte.
  ubicacion: z
    .object({
      latitud: z.number().min(-90).max(90),
      longitud: z.number().min(-180).max(180),
      aproximada: z.boolean(),
    })
    .nullish(),
});

export type DatosReporte = z.infer<typeof esquemaReporte>;
export type CampoReporte = keyof DatosReporte;
export type ErroresReporte = Partial<Record<CampoReporte, string>>;

export type ResultadoValidacion =
  { ok: true; datos: DatosReporte } | { ok: false; errores: ErroresReporte };

/** Valida lo que cargó la persona y devuelve los datos limpios o un error por campo. */
export function validarReporte(entrada: unknown): ResultadoValidacion {
  const resultado = esquemaReporte.safeParse(entrada);
  if (resultado.success) {
    return { ok: true, datos: resultado.data };
  }

  const errores: ErroresReporte = {};
  for (const problema of resultado.error.issues) {
    const campo = problema.path[0] as CampoReporte | undefined;
    // Me quedo con el primer error de cada campo: es el más útil para corregir.
    if (campo && !errores[campo]) {
      errores[campo] = problema.message;
    }
  }
  return { ok: false, errores };
}
