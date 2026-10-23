import type { Sector } from '@/lib/aulas/sectores';
import type { Categoria, Ubicacion } from '@/lib/reportes/tipos';

/** Lo que la persona va cargando en el formulario, todavía sin validar. */
export type Borrador = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria | null;
  ubicacion: Ubicacion | null;
  sector: Sector | null;
};

export const BORRADOR_VACIO: Borrador = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: null,
  ubicacion: null,
  sector: null,
};
