import { interpretarRespuesta } from '@/lib/permisos/interpretar';

describe('interpretarRespuesta', () => {
  it('null es cargando', () => {
    expect(interpretarRespuesta(null)).toBe('cargando');
  });

  it('granted es concedido', () => {
    expect(interpretarRespuesta({ status: 'granted', granted: true, canAskAgain: true })).toBe(
      'concedido',
    );
  });

  it('no concedido con canAskAgain es preguntable', () => {
    expect(interpretarRespuesta({ status: 'denied', granted: false, canAskAgain: true })).toBe(
      'preguntable',
    );
  });

  it('no concedido sin canAskAgain es bloqueado', () => {
    expect(interpretarRespuesta({ status: 'denied', granted: false, canAskAgain: false })).toBe(
      'bloqueado',
    );
  });
});
