// Tokens de diseño de la app. Sin React: cualquier capa los puede importar.

// Los tres colores del instituto.
const VERDE_OSCURO = '#1B3638';
const VERDE_BRILLANTE = '#008F39';
const MARFIL = '#F2EDDE';

export const colores = {
  primario: VERDE_OSCURO,
  primarioTexto: MARFIL,
  /** Solo con letra grande: el marfil sobre este verde no alcanza para texto chico. */
  acento: VERDE_BRILLANTE,
  fondo: MARFIL,
  superficie: '#FBF8EF',
  borde: VERDE_OSCURO,
  texto: VERDE_OSCURO,
  textoSecundario: '#46605B',
  /** Texto secundario sobre verde oscuro. */
  primarioTextoSuave: '#C3CFC4',
  exito: '#00702D',
  advertencia: '#8A5200',
  peligro: '#B3261E',
} as const;

export const espacio = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

export const radio = {
  s: 8,
  m: 14,
  l: 20,
} as const;

export const tipografia = {
  titulo: { fontSize: 22, fontWeight: '700' },
  subtitulo: { fontSize: 17, fontWeight: '600' },
  cuerpo: { fontSize: 15, fontWeight: '400' },
  chico: { fontSize: 13, fontWeight: '400' },
  numero: { fontSize: 26, fontWeight: '700' },
  /** Cuenta como texto grande para el contraste: 19 px en negrita. */
  boton: { fontSize: 19, fontWeight: '700' },
} as const;

export type Color = keyof typeof colores;
