import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Text } from 'react-native';

import FotoReporte from '@/app/reporte/foto';
import { useBorrador } from '@/hooks/useBorrador';
import { Proveedores } from '@/test-utils/Proveedores';

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

beforeEach(() => {
  jest.clearAllMocks();
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
