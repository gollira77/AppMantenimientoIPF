import { render, screen } from '@testing-library/react-native';

import Inicio from '@/app/index';

describe('Pantalla de inicio', () => {
  it('muestra el nombre de la app', () => {
    render(<Inicio />);

    expect(screen.getByText('Mantenimiento IPF')).toBeTruthy();
  });
});
