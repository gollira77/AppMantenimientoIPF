import { textoMatiz } from '@/lib/permisos/matiz';

const base = { status: 'granted', granted: true, canAskAgain: true };

describe('textoMatiz', () => {
  it('no muestra nada mientras no hay respuesta', () => {
    expect(textoMatiz(null)).toBeNull();
  });

  it('no muestra nada si la respuesta no tiene matices', () => {
    expect(textoMatiz(base)).toBeNull();
  });

  it('muestra la precisión de Android', () => {
    expect(textoMatiz({ ...base, android: { accuracy: 'coarse' } })).toBe('accuracy: coarse');
  });

  it('muestra la precisión de iOS', () => {
    expect(textoMatiz({ ...base, ios: { accuracy: 'reduced' } })).toBe('accuracy: reduced');
  });

  it('muestra el acceso a las fotos', () => {
    expect(textoMatiz({ ...base, accessPrivileges: 'limited' })).toBe('accessPrivileges: limited');
  });
});
