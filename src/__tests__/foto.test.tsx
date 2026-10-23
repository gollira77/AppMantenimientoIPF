import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Text } from 'react-native';

import FotoReporte from '@/app/reporte/foto';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('@/hooks/usePermiso');

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn() },
}));

function FotoDelBorrador() {
  const { borrador } = useBorrador();
  return <Text>borrador: {borrador.fotoUri ?? '(sin foto)'}</Text>;
}

function renderFoto() {
  return render(
    <Proveedores>
      <FotoReporte />
      <FotoDelBorrador />
    </Proveedores>,
  );
}

const elegida = {
  canceled: false,
  assets: [{ uri: 'file:///fotos/canilla.jpg', width: 800, height: 600 }],
} as ImagePicker.ImagePickerResult;

function conCamara(...args: Parameters<typeof permisoSimulado>) {
  const simulado = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(simulado);
  return simulado;
}

beforeEach(() => {
  jest.clearAllMocks();
  conCamara('preguntable');
});

describe('Foto desde la galería (sin permiso)', () => {
  it('abre el selector del sistema sin pedir permiso de galería', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Elegir de la galería' }));

    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
    expect(ImagePicker.getMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
  });

  it('pide solo imágenes', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Elegir de la galería' }));

    await waitFor(() =>
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith(
        expect.objectContaining({ mediaTypes: ['images'] }),
      ),
    );
  });

  it('muestra la foto elegida y la guarda en el borrador', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Elegir de la galería' }));
    await waitFor(() => expect(screen.getByLabelText('Foto elegida del desperfecto')).toBeTruthy());
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta foto' }));

    expect(screen.getByText('borrador: file:///fotos/canilla.jpg')).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('si la persona cancela el selector, no pasa nada', async () => {
    jest
      .mocked(ImagePicker.launchImageLibraryAsync)
      .mockResolvedValue({ canceled: true, assets: null });
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Elegir de la galería' }));

    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    expect(screen.queryByLabelText('Foto elegida del desperfecto')).toBeNull();
    expect(screen.getByText('borrador: (sin foto)')).toBeTruthy();
  });

  it('se puede quitar la foto', async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Elegir de la galería' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Usar esta foto' })).toBeTruthy(),
    );
    fireEvent.press(screen.getByRole('button', { name: 'Quitar la foto' }));

    expect(screen.queryByLabelText('Foto elegida del desperfecto')).toBeNull();
  });
});

describe('Sacar foto reutilizando el permiso de cámara (M44)', () => {
  it('usa el mismo permiso de cámara que el escáner', () => {
    renderFoto();

    expect(usePermiso).toHaveBeenCalledWith('camara');
  });

  it('con la cámara concedida, abre la cámara directo sin explicar', async () => {
    const camara = conCamara('concedido');
    jest.mocked(ImagePicker.launchCameraAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Sacar foto' }));

    await waitFor(() => expect(screen.getByLabelText('Foto elegida del desperfecto')).toBeTruthy());
    expect(camara.pedir).not.toHaveBeenCalled();
  });

  it('si es preguntable, explica primero y pide recién con Continuar', async () => {
    const camara = conCamara('preguntable', { pedir: jest.fn().mockResolvedValue('concedido') });
    jest.mocked(ImagePicker.launchCameraAsync).mockResolvedValue(elegida);
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Sacar foto' }));
    expect(camara.pedir).not.toHaveBeenCalled();
    expect(
      screen.getByText('Usamos tu cámara para sacar la foto del desperfecto que reportás.'),
    ).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => expect(ImagePicker.launchCameraAsync).toHaveBeenCalled());
    expect(camara.pedir).toHaveBeenCalledTimes(1);
  });

  it('si dice que no, ofrece la galería y no insiste', async () => {
    conCamara('preguntable');
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Sacar foto' }));
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() =>
      expect(
        screen.getByText('Sin cámara también podés agregar una foto: elegila de la galería.'),
      ).toBeTruthy(),
    );
    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('si está bloqueada, ofrece Abrir Ajustes y la galería', () => {
    const camara = conCamara('bloqueado');
    renderFoto();

    fireEvent.press(screen.getByRole('button', { name: 'Sacar foto' }));
    fireEvent.press(screen.getByRole('button', { name: 'Abrir Ajustes' }));

    expect(camara.abrirAjustes).toHaveBeenCalled();
    expect(camara.pedir).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Elegir de la galería' })).toBeTruthy();
  });
});
