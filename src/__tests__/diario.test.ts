import { escucharDiario, leerDiario, registrarEnDiario, vaciarDiario } from '@/lib/permisos/diario';

beforeEach(() => {
  vaciarDiario();
});

describe('Diario de permisos', () => {
  it('guarda el más nuevo primero', () => {
    registrarEnDiario('camara', 'consulta', 'preguntable');
    registrarEnDiario('camara', 'pedido', 'concedido');

    expect(leerDiario().map((e) => e.accion)).toEqual(['pedido', 'consulta']);
  });

  it('guarda la hora en ISO 8601', () => {
    registrarEnDiario('camara', 'consulta', 'bloqueado', new Date('2026-10-30T12:00:00.000Z'));

    expect(leerDiario()[0]?.hora).toBe('2026-10-30T12:00:00.000Z');
  });

  it('no crece para siempre', () => {
    for (let i = 0; i < 40; i += 1) registrarEnDiario('ubicacion', 'consulta', 'concedido');

    expect(leerDiario()).toHaveLength(30);
  });

  it('avisa a quien escucha y deja de avisar al darse de baja', () => {
    const oyente = jest.fn();
    const baja = escucharDiario(oyente);

    registrarEnDiario('camara', 'consulta', 'concedido');
    baja();
    registrarEnDiario('camara', 'consulta', 'concedido');

    expect(oyente).toHaveBeenCalledTimes(1);
  });

  it('cada cambio crea una lista nueva, para que React lo note', () => {
    const antes = leerDiario();

    registrarEnDiario('camara', 'consulta', 'concedido');

    expect(leerDiario()).not.toBe(antes);
  });
});
