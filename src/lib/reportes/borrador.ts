import type { Categoria } from '@/lib/reportes/tipos';

/** Lo que la persona va cargando en el formulario, todavía sin validar. */
export type Borrador = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria | null;
};

export const BORRADOR_VACIO: Borrador = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: null,
};
