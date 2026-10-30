// Los textos de la pantalla previa. Sin React: los usa la pantalla y los verifican los tests.

export const RECURSOS = ['camara', 'ubicacion'] as const;
export type Recurso = (typeof RECURSOS)[number];

export function esRecurso(valor: string): valor is Recurso {
  return (RECURSOS as readonly string[]).includes(valor);
}

type TextoPrevia = {
  titulo: string;
  /** El beneficio concreto, en una frase. */
  beneficio: string;
};

export const TEXTOS_PREVIA: Record<Recurso, TextoPrevia> = {
  camara: {
    titulo: 'Usar la cámara',
    beneficio: 'Usamos tu cámara para leer el QR del aula y sacar la foto del desperfecto.',
  },
  ubicacion: {
    titulo: 'Usar tu ubicación',
    beneficio: 'Usamos tu ubicación para saber en qué sector del instituto está el desperfecto.',
  },
};
