import { renderRouter } from 'expo-router/testing-library';

// Tabla G1 de la consigna: cada URL tiene que abrir su pantalla (y no la 404).
const rutas = [
  '/',
  '/reporte/nuevo',
  '/reporte/escanear',
  '/reporte/foto',
  '/reporte/ubicacion',
  '/reporte/42',
  '/avisos',
  '/permisos',
  '/permisos/camara',
  '/ajustes-app',
  '/herramientas/qr',
];

const TEXTO_404 = 'Esta pantalla no existe';

describe('Rutas de la app (G1)', () => {
  it.each(rutas)('%s abre su pantalla', (url) => {
    const app = renderRouter('./src/app', { initialUrl: url });

    expect(app.getPathname()).toBe(url);
    expect(app.queryByText(TEXTO_404)).toBeNull();
  });

  it('/reporte/42 recibe el id como parámetro', () => {
    const app = renderRouter('./src/app', { initialUrl: '/reporte/42' });

    expect(app.getSegments()).toEqual(['reporte', '[id]']);
  });

  it('/permisos/camara se abre como pantalla previa', () => {
    const app = renderRouter('./src/app', { initialUrl: '/permisos/camara' });

    expect(app.getSegments()).toEqual(['permisos', '[recurso]']);
  });

  it('una URL inexistente muestra la página 404', () => {
    const app = renderRouter('./src/app', { initialUrl: '/no-existe' });

    expect(app.getByText(TEXTO_404)).toBeTruthy();
  });
});
