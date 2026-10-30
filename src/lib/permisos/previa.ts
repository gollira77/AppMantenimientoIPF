// Los textos de la pantalla previa. Sin React: los usa la pantalla y los verifican los tests.

export const RECURSOS = ['camara', 'ubicacion', 'notificaciones'] as const;
export type Recurso = (typeof RECURSOS)[number];

export function esRecurso(valor: string): valor is Recurso {
  return (RECURSOS as readonly string[]).includes(valor);
}

type TextoPrevia = {
  titulo: string;
  /** El beneficio concreto, en una frase. */
  beneficio: string;
  /** Qué ve la persona si el permiso está bloqueado y solo se cambia desde Ajustes. */
  comoHabilitar: string;
};

export const TEXTOS_PREVIA: Record<Recurso, TextoPrevia> = {
  camara: {
    titulo: 'Usar la cámara',
    beneficio: 'Usamos tu cámara para leer el QR del aula y sacar la foto del desperfecto.',
    comoHabilitar: 'La cámara está desactivada. Habilitala para esta app en Ajustes y volvé acá.',
  },
  ubicacion: {
    titulo: 'Usar tu ubicación',
    beneficio: 'Usamos tu ubicación para saber en qué sector del instituto está el desperfecto.',
    comoHabilitar:
      'La ubicación está desactivada. Habilitala para esta app en Ajustes y volvé acá.',
  },
  notificaciones: {
    titulo: 'Recibir notificaciones',
    beneficio: 'Usamos las notificaciones para avisarte cuando se resuelva tu reporte.',
    comoHabilitar:
      'Las notificaciones están desactivadas. Habilitalas para esta app en Ajustes y volvé acá.',
  },
};
