import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

describe('Lista de reportes', () => {
  it('muestra los reportes de prueba con su estado', () => {
    renderRouter('./src/app', { initialUrl: '/' });

    expect(screen.getByText('Enchufe quemado')).toBeTruthy();
    expect(screen.getByText('Canilla que gotea')).toBeTruthy();
    expect(screen.getByText('Pendiente')).toBeTruthy();
    expect(screen.getByText('Resuelto')).toBeTruthy();
  });

  it('abre el detalle al tocar un reporte', () => {
    const app = renderRouter('./src/app', { initialUrl: '/' });

    fireEvent.press(screen.getByText('Enchufe quemado'));

    expect(app.getPathname()).toBe('/reporte/1');
  });

  it('abre el formulario con el botón Nuevo reporte', () => {
    const app = renderRouter('./src/app', { initialUrl: '/' });

    fireEvent.press(screen.getByRole('button', { name: 'Nuevo reporte' }));

    expect(app.getPathname()).toBe('/reporte/nuevo');
  });
});
