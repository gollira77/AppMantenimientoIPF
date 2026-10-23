import { fireEvent, render, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Alert } from 'react-native';

import NuevoReporte from '@/app/reporte/nuevo';
import { ProveedorReportes } from '@/hooks/useReportes';

describe('Formulario de nuevo reporte', () => {
  it('muestra los cuatro campos', () => {
    render(<NuevoReporte />, { wrapper: ProveedorReportes });

    expect(screen.getByLabelText('Título')).toBeTruthy();
    expect(screen.getByLabelText('Descripción')).toBeTruthy();
    expect(screen.getByLabelText('Aula')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Electricidad' })).toBeTruthy();
  });

  it('marca la categoría elegida', () => {
    render(<NuevoReporte />, { wrapper: ProveedorReportes });

    fireEvent.press(screen.getByRole('radio', { name: 'Agua' }));

    expect(screen.getByRole('radio', { name: 'Agua' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Mobiliario' })).not.toBeChecked();
  });
});

describe('Formulario de nuevo reporte: errores', () => {
  it('muestra los errores al guardar vacío y no navega', () => {
    render(<NuevoReporte />, { wrapper: ProveedorReportes });

    fireEvent.press(screen.getByRole('button', { name: 'Guardar reporte' }));

    expect(screen.getByText('El título tiene que tener al menos 3 letras.')).toBeTruthy();
    expect(screen.getByText('Elegí una categoría.')).toBeTruthy();
  });

  it('con datos válidos guarda y vuelve a la lista', () => {
    const alerta = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const app = renderRouter('./src/app', { initialUrl: '/' });
    fireEvent.press(screen.getByRole('button', { name: 'Nuevo reporte' }));
    expect(app.getPathname()).toBe('/reporte/nuevo');

    fireEvent.press(screen.getByRole('button', { name: 'Guardar reporte' }));
    expect(screen.getByText('Elegí una categoría.')).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText('Título'), 'Enchufe quemado');
    fireEvent.changeText(screen.getByLabelText('Descripción'), 'Tiene olor a quemado y no anda.');
    fireEvent.changeText(screen.getByLabelText('Aula'), 'b12');
    fireEvent.press(screen.getByRole('radio', { name: 'Electricidad' }));
    fireEvent.press(screen.getByRole('button', { name: 'Guardar reporte' }));

    expect(alerta).toHaveBeenCalledWith('Reporte creado', '"Enchufe quemado" quedó registrado.');
    expect(app.getPathname()).toBe('/');
  });
});
