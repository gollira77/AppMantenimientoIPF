import { render, screen } from '@testing-library/react-native';

import Reportes from '@/app/(tabs)/index';

describe('Pantalla de reportes', () => {
  it('muestra el título de la lista', () => {
    render(<Reportes />);

    expect(screen.getByText('Mis reportes')).toBeTruthy();
  });
});
