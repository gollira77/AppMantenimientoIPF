import { fireEvent, render, screen } from '@testing-library/react-native';

import NuevoReporte from '@/app/reporte/nuevo';

describe('Formulario de nuevo reporte', () => {
  it('muestra los cuatro campos', () => {
    render(<NuevoReporte />);

    expect(screen.getByLabelText('Título')).toBeTruthy();
    expect(screen.getByLabelText('Descripción')).toBeTruthy();
    expect(screen.getByLabelText('Aula')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Electricidad' })).toBeTruthy();
  });

  it('marca la categoría elegida', () => {
    render(<NuevoReporte />);

    fireEvent.press(screen.getByRole('radio', { name: 'Agua' }));

    expect(screen.getByRole('radio', { name: 'Agua' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Mobiliario' })).not.toBeChecked();
  });
});
