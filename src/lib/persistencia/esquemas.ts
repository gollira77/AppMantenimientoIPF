import { z } from 'zod';

import { SECTORES } from '@/lib/aulas/sectores';
import { CATEGORIAS } from '@/lib/reportes/tipos';

export const esquemaAvisos = z.array(
  z.object({
    id: z.string(),
    reporteId: z.string(),
    mensaje: z.string(),
    creadoEn: z.string(),
    leido: z.boolean(),
  }),
);

// El borrador se guarda como está, a medio escribir: acá no se valida si está completo.
export const esquemaBorrador = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  aula: z.string(),
  categoria: z.enum(CATEGORIAS).nullable(),
  ubicacion: z
    .object({ latitud: z.number(), longitud: z.number(), aproximada: z.boolean() })
    .nullable(),
  sector: z.enum(SECTORES).nullable(),
  fotoUri: z.string().nullable(),
});

export const esquemaPreferencias = z.object({ quiereAvisos: z.boolean() });
