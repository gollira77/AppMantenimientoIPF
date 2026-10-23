import { act, fireEvent, renderHook, renderRouter, screen } from 'expo-router/testing-library';
import { Alert } from 'react-native';

import { ProveedorReportes, useReportes } from '@/hooks/useReportes';
import { crearReporte, generarId } from '@/lib/reportes/crear';

const datos = {
  titulo: 'Silla rota',
  descripcion: 'La silla de la primera fila tiene una pata floja.',
  aula: 'A3',
  categoria: 'mobiliario' as const,
};

describe('crearReporte', () => {
  it('arma un reporte pendiente con id y fecha', () => {
    const ahora = new Date('2026-10-23T12:00:00.000Z');
    const reporte = crearReporte(datos, ahora);

    expect(reporte).toMatchObject({ ...datos, estado: 'pendiente', creadoEn: ahora.toISOString() });
    expect(reporte.id).toMatch(/^[a-z0-9]+-[a-z0-9]{4}$/);
  });

  it('genera ids distintos en el mismo milisegundo', () => {
    const ahora = new Date();
    expect(generarId(ahora, () => 0.1)).not.toBe(generarId(ahora, () => 0.2));
  });
});

describe('useReportes', () => {
  it('falla con un mensaje claro fuera del proveedor', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useReportes())).toThrow('dentro de <ProveedorReportes>');
  });

  it('agrega el reporte nuevo al principio de la lista', () => {
    const { result } = renderHook(() => useReportes(), {
      wrapper: ({ children }) => <ProveedorReportes iniciales={[]}>{children}</ProveedorReportes>,
    });

    act(() => {
      result.current.agregar(datos);
    });

    expect(result.current.reportes).toHaveLength(1);
    expect(result.current.reportes[0]?.titulo).toBe('Silla rota');
  });
});

describe('Flujo completo (el problema de M17)', () => {
  it('el reporte creado aparece en la lista y su detalle se abre', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const app = renderRouter('./src/app', { initialUrl: '/' });

    fireEvent.press(screen.getByRole('button', { name: 'Nuevo reporte' }));
    fireEvent.changeText(screen.getByLabelText('Título'), datos.titulo);
    fireEvent.changeText(screen.getByLabelText('Descripción'), datos.descripcion);
    fireEvent.changeText(screen.getByLabelText('Aula'), datos.aula);
    fireEvent.press(screen.getByRole('radio', { name: 'Mobiliario' }));
    fireEvent.press(screen.getByRole('button', { name: 'Guardar reporte' }));

    expect(app.getPathname()).toBe('/');
    fireEvent.press(screen.getByText('Silla rota'));

    expect(app.getPathname()).toMatch(/^\/reporte\/[a-z0-9-]+$/);
    expect(screen.getByText('La silla de la primera fila tiene una pata floja.')).toBeTruthy();
  });
});
