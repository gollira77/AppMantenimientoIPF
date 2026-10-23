import { validarReporte } from '@/lib/reportes/esquema';

const valido = {
  titulo: 'Enchufe quemado',
  descripcion: 'El enchufe del fondo tiene olor a quemado.',
  aula: 'B12',
  categoria: 'electricidad',
};

function erroresDe(entrada: unknown) {
  const resultado = validarReporte(entrada);
  if (resultado.ok) throw new Error('Se esperaba un error de validación');
  return resultado.errores;
}

describe('validarReporte', () => {
  it('acepta un reporte completo y limpia los datos', () => {
    const resultado = validarReporte({ ...valido, titulo: '  Enchufe quemado  ', aula: ' lab-2 ' });

    expect(resultado).toEqual({
      ok: true,
      datos: { ...valido, aula: 'LAB-2' },
    });
  });

  it('rechaza el formulario vacío con un error por campo', () => {
    const errores = erroresDe({ titulo: '', descripcion: '', aula: '', categoria: null });

    expect(Object.keys(errores).sort()).toEqual(['aula', 'categoria', 'descripcion', 'titulo']);
  });

  it.each([
    ['muy corto', 'ab', 'al menos 3'],
    ['solo espacios', '     ', 'al menos 3'],
    ['muy largo', 'x'.repeat(61), 'hasta 60'],
  ])('rechaza un título %s', (_caso, titulo, mensaje) => {
    expect(erroresDe({ ...valido, titulo }).titulo).toContain(mensaje);
  });

  it('rechaza una descripción de menos de 10 letras', () => {
    expect(erroresDe({ ...valido, descripcion: 'roto' }).descripcion).toContain('al menos 10');
  });

  it('rechaza una descripción de más de 500 letras', () => {
    expect(erroresDe({ ...valido, descripcion: 'x'.repeat(501) }).descripcion).toContain(
      'hasta 500',
    );
  });

  it.each(['B 12', 'B12!', '-B12', 'B12-', 'AULA/3'])('rechaza el aula "%s"', (aula) => {
    expect(erroresDe({ ...valido, aula }).aula).toContain('letras, números y guiones');
  });

  it('rechaza un aula vacía con un mensaje que menciona el QR', () => {
    expect(erroresDe({ ...valido, aula: '' }).aula).toContain('QR');
  });

  it('rechaza un aula demasiado larga', () => {
    expect(erroresDe({ ...valido, aula: 'A'.repeat(13) }).aula).toContain('demasiado largo');
  });

  it.each([null, '', 'gas', 'Agua'])('rechaza la categoría %p', (categoria) => {
    expect(erroresDe({ ...valido, categoria }).categoria).toBe('Elegí una categoría.');
  });

  it('no se rompe si recibe algo que no es un objeto', () => {
    expect(validarReporte(undefined).ok).toBe(false);
    expect(validarReporte('hola').ok).toBe(false);
  });
});
