import { fireEvent, render, screen } from '@testing-library/react-native';
import { PermissionStatus, useCameraPermissions, type PermissionResponse } from 'expo-camera';
import { Linking } from 'react-native';

import EscanearAula from '@/app/reporte/escanear';

jest.mock('expo-camera', () => ({
  CameraView: () => {
    const { Text: TextoMock } = jest.requireActual('react-native');
    return <TextoMock>vista de cámara</TextoMock>;
  },
  useCameraPermissions: jest.fn(),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
}));

const usarPermisos = jest.mocked(useCameraPermissions);
const pedir = jest.fn();

function respuesta(
  status: PermissionStatus,
  granted: boolean,
  canAskAgain: boolean,
): PermissionResponse {
  return { status, granted, canAskAgain, expires: 'never' };
}

function conPermiso(permiso: PermissionResponse | null) {
  usarPermisos.mockReturnValue([permiso, pedir, jest.fn()]);
}

beforeEach(() => {
  pedir.mockReset();
});

describe('Escáner: los cuatro estados del permiso', () => {
  it('1. cargando: con null muestra el mensaje de carga y ningún botón', () => {
    conPermiso(null);
    render(<EscanearAula />);

    expect(screen.getByText('Consultando el permiso de la cámara…')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('2. concedido: muestra la cámara', () => {
    conPermiso(respuesta(PermissionStatus.GRANTED, true, true));
    render(<EscanearAula />);

    expect(screen.getByText('vista de cámara')).toBeTruthy();
  });

  it.each([
    ['sin decidir', PermissionStatus.UNDETERMINED],
    ['denegado una vez', PermissionStatus.DENIED],
  ])('3. preguntable (%s): explica y pide con Continuar', (_caso, status) => {
    conPermiso(respuesta(status, false, true));
    render(<EscanearAula />);

    expect(screen.queryByRole('button', { name: 'Permitir' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    expect(pedir).toHaveBeenCalledTimes(1);
  });

  it('4. bloqueado: no vuelve a pedir y ofrece Abrir Ajustes', () => {
    const abrirAjustes = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    conPermiso(respuesta(PermissionStatus.DENIED, false, false));
    render(<EscanearAula />);

    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Abrir Ajustes' }));

    expect(abrirAjustes).toHaveBeenCalled();
    expect(pedir).not.toHaveBeenCalled();
  });
});
