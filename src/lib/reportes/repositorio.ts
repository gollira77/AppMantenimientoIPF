import { z } from 'zod';

import { escribirGuardado, leerGuardado } from '@/lib/persistencia/almacen';
import { esquemaReporte } from '@/lib/reportes/esquema';
import { ESTADOS, type Reporte } from '@/lib/reportes/tipos';

/** Lo que el contexto necesita saber para guardar reportes, sin saber dónde se guardan. */
export type RepositorioReportes = {
  /** `null` si todavía no hay nada guardado. */
  cargar: () => Promise<Reporte[] | null>;
  guardar: (reportes: Reporte[]) => Promise<void>;
};

const CLAVE = 'mantenimiento-ipf/reportes/v1';

const esquemaGuardado = z.array(
  esquemaReporte.extend({
    id: z.string().min(1),
    estado: z.enum(ESTADOS),
    creadoEn: z.string(),
  }),
);

export const repositorioAsyncStorage: RepositorioReportes = {
  cargar: () => leerGuardado(CLAVE, esquemaGuardado),
  guardar: (reportes) => escribirGuardado(CLAVE, reportes),
};
