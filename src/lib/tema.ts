// Tokens de diseño de la app. Sin React: cualquier capa los puede importar.

export const colores = {
  primario: '#1565C0',
  primarioTexto: '#FFFFFF',
  fondo: '#F5F7FA',
  superficie: '#FFFFFF',
  borde: '#D5DBE3',
  texto: '#1B1F24',
  textoSecundario: '#5B6573',
  exito: '#2E7D32',
  advertencia: '#B26A00',
  peligro: '#C62828',
} as const;

export const espacio = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

export const radio = {
  s: 6,
  m: 12,
} as const;

export const tipografia = {
  titulo: { fontSize: 22, fontWeight: '700' },
  subtitulo: { fontSize: 17, fontWeight: '600' },
  cuerpo: { fontSize: 15, fontWeight: '400' },
  chico: { fontSize: 13, fontWeight: '400' },
} as const;

export type Color = keyof typeof colores;
