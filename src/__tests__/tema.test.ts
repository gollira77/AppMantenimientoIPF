import { contarPorEstado } from '@/lib/reportes/resumen';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';
import { colores } from '@/lib/tema';

// Fórmula de contraste de WCAG 2.
function luminancia(hex: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [mayor, menor] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (mayor + 0.05) / (menor + 0.05);
}

describe('Colores del instituto', () => {
  it('usa los tres colores de la paleta', () => {
    expect(colores.primario).toBe('#1B3638');
    expect(colores.acento).toBe('#008F39');
    expect(colores.fondo).toBe('#F2EDDE');
  });

  it.each([
    ['texto sobre fondo', colores.texto, colores.fondo],
    ['texto sobre superficie', colores.texto, colores.superficie],
    ['secundario sobre fondo', colores.textoSecundario, colores.fondo],
    ['secundario sobre superficie', colores.textoSecundario, colores.superficie],
    ['marfil sobre verde oscuro', colores.primarioTexto, colores.primario],
    ['suave sobre verde oscuro', colores.primarioTextoSuave, colores.primario],
    ['etiqueta pendiente', colores.primarioTexto, colores.advertencia],
    ['etiqueta resuelto', colores.primarioTexto, colores.exito],
    ['error sobre fondo', colores.peligro, colores.fondo],
  ])('%s llega a 4.5:1', (_nombre, frente, atras) => {
    expect(contraste(frente, atras)).toBeGreaterThanOrEqual(4.5);
  });

  it('el botón principal llega a 3:1, el mínimo para texto grande', () => {
    expect(contraste(colores.primarioTexto, colores.acento)).toBeGreaterThanOrEqual(3);
  });
});

describe('contarPorEstado', () => {
  it('cuenta cada estado', () => {
    const cuentas = contarPorEstado(REPORTES_DE_PRUEBA);
    const total = cuentas.pendiente + cuentas.en_proceso + cuentas.resuelto;

    expect(total).toBe(REPORTES_DE_PRUEBA.length);
  });

  it('sin reportes, todo en cero', () => {
    expect(contarPorEstado([])).toEqual({ pendiente: 0, en_proceso: 0, resuelto: 0 });
  });
});
