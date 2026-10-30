import { PREFIJO_QR, codigoQrDeAula, leerCodigoAula } from '@/lib/aulas/codigoQr';

describe('leerCodigoAula', () => {
  it.each([
    ['IPF-AULA:B12', 'B12'],
    ['IPF-AULA:LAB-2', 'LAB-2'],
    ['IPF-AULA:PB-BAÑO', 'PB-BAÑO'],
    ['ipf-aula:b12', 'B12'],
    ['  IPF-AULA:B12  ', 'B12'],
    ['IPF-AULA: a3 ', 'A3'],
  ])('lee "%s" como el aula %s', (datos, aula) => {
    expect(leerCodigoAula(datos)).toEqual({ tipo: 'aula', aula });
  });

  it.each([
    ['vacío', ''],
    ['una URL', 'https://example.com/menu'],
    ['otro prefijo', 'AULA:B12'],
    ['el prefijo solo', 'IPF-AULA:'],
    ['prefijo con espacios', 'IPF-AULA:   '],
    ['espacio en el medio', 'IPF-AULA:B 12'],
    ['símbolos', 'IPF-AULA:B12;DROP'],
    ['guion al final', 'IPF-AULA:B12-'],
    ['demasiado largo', `IPF-AULA:${'A'.repeat(13)}`],
    ['el prefijo en el medio', 'XXIPF-AULA:B12'],
  ])('marca como ajeno un QR con %s', (_caso, datos) => {
    expect(leerCodigoAula(datos)).toEqual({ tipo: 'ajeno' });
  });
});

describe('codigoQrDeAula', () => {
  it('arma el texto del QR con el prefijo y en mayúsculas', () => {
    expect(codigoQrDeAula(' b12 ')).toBe(`${PREFIJO_QR}B12`);
  });

  it.each(['B12', 'LAB-2', 'PB-BAÑO', 'A3'])(
    'ida y vuelta: el QR de %s se lee como esa aula',
    (aula) => {
      expect(leerCodigoAula(codigoQrDeAula(aula))).toEqual({ tipo: 'aula', aula });
    },
  );
});
