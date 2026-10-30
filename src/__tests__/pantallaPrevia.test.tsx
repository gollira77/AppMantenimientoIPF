import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';

import PantallaPrevia from '@/app/permisos/[recurso]';
import { usePermiso } from '@/hooks/usePermiso';
import { TEXTOS_PREVIA } from '@/lib/permisos/previa';
import { permisoSimulado } from '@/test-utils/permisoSimulado';

jest.mock('@/hooks/usePermiso');

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn() },
  useLocalSearchParams: jest.fn(),
  Link: () => null,
}));

function abrir(recurso: string, ...args: Parameters<typeof permisoSimulado>) {
  const simulado = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(simulado);
  jest.mocked(useLocalSearchParams).mockReturnValue({ recurso });
  render(<PantallaPrevia />);
  return simulado;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Pantalla previa', () => {
  it('muestra el beneficio y aclara que se puede cambiar en Ajustes', () => {
    abrir('camara', 'preguntable');

    expect(screen.getByText(TEXTOS_PREVIA.camara.beneficio)).toBeTruthy();
    expect(screen.getByText('Podés cambiar este permiso cuando quieras en Ajustes.')).toBeTruthy();
  });

  it('tiene un único botón, Continuar', () => {
    abrir('ubicacion', 'preguntable');

    expect(screen.getAllByRole('button').map((b) => b.props.accessibilityLabel)).toEqual([
      'Continuar',
    ]);
    expect(screen.queryByText('Ahora no')).toBeNull();
    expect(screen.queryByText('Cerrar')).toBeNull();
  });

  it('no pide el permiso al abrirse', () => {
    const permiso = abrir('camara', 'preguntable');

    expect(permiso.pedir).not.toHaveBeenCalled();
  });

  it('Continuar pide el permiso y cierra la pantalla', async () => {
    const permiso = abrir('camara', 'preguntable');

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => expect(router.back).toHaveBeenCalled());
    expect(permiso.pedir).toHaveBeenCalledTimes(1);
  });

  it('usa el permiso del recurso de la URL', () => {
    abrir('ubicacion', 'preguntable');

    expect(usePermiso).toHaveBeenCalledWith('ubicacion');
  });

  it('muestra un mensaje si el recurso no existe', () => {
    abrir('telepatia', 'preguntable');

    expect(screen.getByText('No conocemos ese permiso')).toBeTruthy();
    expect(usePermiso).not.toHaveBeenCalled();
  });
});
