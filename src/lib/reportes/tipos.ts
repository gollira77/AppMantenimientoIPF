// Modelo de datos de un reporte. Sin React: lo usan pantallas, hooks y tests.

export const CATEGORIAS = ['electricidad', 'agua', 'mobiliario', 'equipos'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ESTADOS = ['pendiente', 'en_proceso', 'resuelto'] as const;
export type Estado = (typeof ESTADOS)[number];

export type Ubicacion = {
  latitud: number;
  longitud: number;
};

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  /** Código del aula, por ejemplo "B12". */
  aula: string;
  categoria: Categoria;
  estado: Estado;
  /** Fecha de creación en formato ISO 8601. */
  creadoEn: string;
  /** Opcional: solo si la persona compartió su ubicación. */
  ubicacion?: Ubicacion | null;
};

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  electricidad: 'Electricidad',
  agua: 'Agua',
  mobiliario: 'Mobiliario',
  equipos: 'Equipos',
};

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
};

export function esCategoria(valor: string): valor is Categoria {
  return (CATEGORIAS as readonly string[]).includes(valor);
}
