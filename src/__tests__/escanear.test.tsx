import { fireEvent, render, screen } from '@testing-library/react-native';
import { useCameraPermissions, type PermissionResponse } from 'expo-camera';

import EscanearAula from '@/app/reporte/escanear';

jest.mock('expo-camera', () => ({
  CameraView: () => {
    const { Text: TextoMock } = jest.requireActual('react-native');
    return <TextoMock>vista de cámara</TextoMock>;
  },
  useCameraPermissions: jest.fn(),
}));

const usarPermisos = jest.mocked(useCameraPermissions);
const pedir = jest.fn();

function conPermiso(permiso: Partial<PermissionResponse> | null) {
  usarPermisos.mockReturnValue([permiso as PermissionResponse | null, pedir, jest.fn()]);
}

beforeEach(() => {
  pedir.mockReset();
});

describe('Escáner (versión ingenua)', () => {
  it('muestra la cámara si el permiso está concedido', () => {
    conPermiso({ granted: true, status: 'granted' as PermissionResponse['status'] });
    render(<EscanearAula />);

    expect(screen.getByText('vista de cámara')).toBeTruthy();
  });

  it('si no está concedido, ofrece pedirlo', () => {
    conPermiso({ granted: false, canAskAgain: true });
    render(<EscanearAula />);

    fireEvent.press(screen.getByRole('button', { name: 'Permitir' }));

    expect(pedir).toHaveBeenCalled();
  });

  it('no se rompe en el primer render, cuando el permiso es null', () => {
    conPermiso(null);
    render(<EscanearAula />);

    expect(screen.queryByText('vista de cámara')).toBeNull();
  });
});
