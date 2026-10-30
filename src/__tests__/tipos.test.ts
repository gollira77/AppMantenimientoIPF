import {
  CATEGORIAS,
  ESTADOS,
  ETIQUETA_CATEGORIA,
  ETIQUETA_ESTADO,
  esCategoria,
} from '@/lib/reportes/tipos';

describe('tipos de reporte', () => {
  it('tiene las cuatro categorías de la consigna', () => {
    expect(CATEGORIAS).toEqual(['electricidad', 'agua', 'mobiliario', 'equipos']);
  });

  it('cada categoría y cada estado tienen su etiqueta', () => {
    for (const categoria of CATEGORIAS) {
      expect(ETIQUETA_CATEGORIA[categoria]).toBeTruthy();
    }
    for (const estado of ESTADOS) {
      expect(ETIQUETA_ESTADO[estado]).toBeTruthy();
    }
  });

  it('esCategoria reconoce solo las categorías válidas', () => {
    expect(esCategoria('agua')).toBe(true);
    expect(esCategoria('gas')).toBe(false);
    expect(esCategoria('')).toBe(false);
  });
});
