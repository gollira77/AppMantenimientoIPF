import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { PermissionStatus, useCameraPermissions, type PermissionResponse } from 'expo-camera';
import { Linking } from 'react-native';

import { leerCodigoAula } from '@/lib/aulas/codigoQr';

import EscanearAula from '@/app/reporte/escanear';

jest.mock('expo-camera', () => ({
  // La cámara simulada tiene dos botones que disparan lecturas, como si enfocara un QR.
  CameraView: ({ onBarcodeScanned }: { onBarcodeScanned?: (r: { data: string }) => void }) => {
    const { Pressable, Text: TextoMock, View } = jest.requireActual('react-native');
    return (
      <View>
        <TextoMock>vista de cámara</TextoMock>
        <Pressable onPress={() => onBarcodeScanned?.({ data: 'IPF-AULA:B12' })}>
          <TextoMock>leer QR de aula</TextoMock>
        </Pressable>
        <Pressable onPress={() => onBarcodeScanned?.({ data: 'https://example.com' })}>
          <TextoMock>leer QR ajeno</TextoMock>
        </Pressable>
      </View>
    );
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
  // Por defecto, la persona contesta "No permitir" en el diálogo.
  pedir.mockResolvedValue(respuesta(PermissionStatus.DENIED, false, true));
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
  ])('3. preguntable (%s): explica y pide con Continuar', async (_caso, status) => {
    conPermiso(respuesta(status, false, true));
    render(<EscanearAula />);

    expect(screen.queryByRole('button', { name: 'Permitir' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    expect(pedir).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('Escribí el código del aula')).toBeTruthy());
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

jest.mock('@/lib/aulas/codigoQr', () => {
  const real = jest.requireActual('@/lib/aulas/codigoQr');
  return { ...real, leerCodigoAula: jest.fn(real.leerCodigoAula) };
});

describe('Escáner: lectura del QR', () => {
  beforeEach(() => {
    jest.mocked(leerCodigoAula).mockClear();
    conPermiso(respuesta(PermissionStatus.GRANTED, true, true));
  });

  it('muestra el aula leída', () => {
    render(<EscanearAula />);

    fireEvent.press(screen.getByText('leer QR de aula'));

    expect(screen.getByText('Aula B12')).toBeTruthy();
  });

  it('procesa una sola lectura aunque la cámara dispare varias seguidas', () => {
    render(<EscanearAula />);
    const boton = screen.getByText('leer QR de aula');

    fireEvent.press(boton);
    fireEvent.press(boton);
    fireEvent.press(boton);

    expect(leerCodigoAula).toHaveBeenCalledTimes(1);
  });

  it('avisa si el QR no es de un aula y permite escanear otra vez', () => {
    render(<EscanearAula />);

    fireEvent.press(screen.getByText('leer QR ajeno'));
    expect(screen.getByText('Ese QR no es de un aula')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Escanear otra vez' }));
    fireEvent.press(screen.getByText('leer QR de aula'));

    expect(screen.getByText('Aula B12')).toBeTruthy();
    expect(leerCodigoAula).toHaveBeenCalledTimes(2);
  });
});

describe('Escáner: carga manual del aula (M28)', () => {
  it('si se deniega en el diálogo, ofrece escribir el aula y no vuelve a explicar', async () => {
    conPermiso(respuesta(PermissionStatus.UNDETERMINED, false, true));
    render(<EscanearAula />);

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => expect(screen.getByLabelText('Código del aula')).toBeTruthy());
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('si la cámara está bloqueada, se puede escribir el aula', () => {
    conPermiso(respuesta(PermissionStatus.DENIED, false, false));
    render(<EscanearAula />);

    fireEvent.changeText(screen.getByLabelText('Código del aula'), 'lab-2');
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta aula' }));

    expect(screen.getByText('Aula LAB-2')).toBeTruthy();
  });

  it('valida el aula escrita con la misma regla del formulario', () => {
    conPermiso(respuesta(PermissionStatus.DENIED, false, false));
    render(<EscanearAula />);

    fireEvent.changeText(screen.getByLabelText('Código del aula'), 'B 12');
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta aula' }));

    expect(screen.getByText('Usá letras, números y guiones, por ejemplo B12.')).toBeTruthy();
    expect(screen.queryByText('Aula B 12')).toBeNull();
  });
});
