import {
  esParcial,
  interpretarRespuesta,
  type EstadoPermiso,
  type RespuestaPermiso,
} from '@/lib/permisos/interpretar';

// Tabla D3 de la consigna. Las respuestas reales siempre traen granted, canAskAgain y status,
// así que completo los campos que la tabla abrevia con los valores que devuelve Expo.
type Fila = { descripcion: string; respuesta: RespuestaPermiso | null; esperado: EstadoPermiso };

const tablaD3: Fila[] = [
  { descripcion: 'null (el hook todavía consulta)', respuesta: null, esperado: 'cargando' },
  {
    descripcion: "{ status: 'granted', granted: true }",
    respuesta: { status: 'granted', granted: true, canAskAgain: true },
    esperado: 'concedido',
  },
  {
    descripcion: "{ status: 'undetermined', canAskAgain: true }",
    respuesta: { status: 'undetermined', granted: false, canAskAgain: true },
    esperado: 'preguntable',
  },
  {
    descripcion: "{ status: 'denied', canAskAgain: true }",
    respuesta: { status: 'denied', granted: false, canAskAgain: true },
    esperado: 'preguntable',
  },
  {
    descripcion: "{ status: 'denied', canAskAgain: false }",
    respuesta: { status: 'denied', granted: false, canAskAgain: false },
    esperado: 'bloqueado',
  },
  {
    descripcion: "{ status: 'granted', accessPrivileges: 'limited' }",
    respuesta: {
      status: 'granted',
      granted: true,
      canAskAgain: true,
      accessPrivileges: 'limited',
    } as RespuestaPermiso,
    esperado: 'concedido',
  },
  {
    descripcion: "{ status: 'granted', android: { accuracy: 'coarse' } }",
    respuesta: {
      status: 'granted',
      granted: true,
      canAskAgain: true,
      android: { accuracy: 'coarse' },
    } as RespuestaPermiso,
    esperado: 'concedido',
  },
];

describe('interpretarRespuesta: tabla D3', () => {
  it.each(tablaD3)('$descripcion → $esperado', ({ respuesta, esperado }) => {
    expect(interpretarRespuesta(respuesta)).toBe(esperado);
  });
});

describe('interpretarRespuesta: casos de borde', () => {
  it('undefined también es cargando', () => {
    expect(interpretarRespuesta(undefined)).toBe('cargando');
  });

  it('concedido gana aunque canAskAgain sea false', () => {
    expect(interpretarRespuesta({ status: 'granted', granted: true, canAskAgain: false })).toBe(
      'concedido',
    );
  });

  it('en iOS, después del primer "no", queda bloqueado', () => {
    // iOS muestra el diálogo una sola vez: el primer "No permitir" ya devuelve canAskAgain: false.
    expect(interpretarRespuesta({ status: 'denied', granted: false, canAskAgain: false })).toBe(
      'bloqueado',
    );
  });

  it('"Solo esta vez" vencido en Android vuelve a ser preguntable', () => {
    // Al revocarse el permiso temporal, Android lo informa como denegado pero se puede volver a pedir.
    expect(interpretarRespuesta({ status: 'denied', granted: false, canAskAgain: true })).toBe(
      'preguntable',
    );
  });
});

describe('esParcial', () => {
  const concedido = { status: 'granted', granted: true, canAskAgain: true };

  it.each([
    ['fotos limitadas', { ...concedido, accessPrivileges: 'limited' }],
    ['ubicación aproximada en Android', { ...concedido, android: { accuracy: 'coarse' } }],
    ['ubicación aproximada en iOS', { ...concedido, ios: { accuracy: 'reduced' } }],
  ])('%s es parcial', (_caso, respuesta) => {
    expect(esParcial(respuesta)).toBe(true);
  });

  it.each([
    ['null', null],
    ['concedido sin matices', concedido],
    ['todas las fotos', { ...concedido, accessPrivileges: 'all' }],
    ['ubicación precisa en Android', { ...concedido, android: { accuracy: 'fine' } }],
    ['ubicación precisa en iOS', { ...concedido, ios: { accuracy: 'full' } }],
    [
      'denegado (aunque diga coarse)',
      { status: 'denied', granted: false, canAskAgain: true, android: { accuracy: 'coarse' } },
    ],
  ])('%s no es parcial', (_caso, respuesta) => {
    expect(esParcial(respuesta)).toBe(false);
  });
});
