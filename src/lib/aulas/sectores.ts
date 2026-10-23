// Sectores del edificio para ubicar el desperfecto sin GPS.
export const SECTORES = [
  'Planta baja · Hall de entrada',
  'Planta baja · Baños',
  'Planta baja · Aulas A',
  'Primer piso · Aulas B',
  'Primer piso · Laboratorios',
  'Biblioteca',
  'Patio y exteriores',
] as const;

export type Sector = (typeof SECTORES)[number];
