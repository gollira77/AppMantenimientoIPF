import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import { usePermiso } from '@/hooks/usePermiso';
import { permisoSimulado } from '@/test-utils/permisoSimulado';

jest.mock('@/hooks/usePermiso');

// Cámara concedida con un botón que simula leer el QR del aula B12.
jest.mock('expo-camera', () => ({
  CameraView: ({ onBarcodeScanned }: { onBarcodeScanned?: (r: { data: string }) => void }) => {
    const { Pressable, Text } = jest.requireActual('react-native');
    return (
      <Pressable onPress={() => onBarcodeScanned?.({ data: 'IPF-AULA:B12' })}>
        <Text>leer QR de aula</Text>
      </Pressable>
    );
  },
}));

beforeEach(() => {
  jest.mocked(usePermiso).mockReturnValue(permisoSimulado('concedido'));
});

describe('Borrador compartido (el problema de M26)', () => {
  it('el aula escaneada completa el formulario sin perder lo ya escrito', () => {
    const app = renderRouter('./src/app', { initialUrl: '/' });
    fireEvent.press(screen.getByRole('button', { name: 'Nuevo reporte' }));
    fireEvent.changeText(screen.getByLabelText('Título'), 'Ventana rota');

    fireEvent.press(screen.getByRole('button', { name: 'Escanear QR del aula' }));
    expect(app.getPathname()).toBe('/reporte/escanear');
    fireEvent.press(screen.getByText('leer QR de aula'));

    expect(app.getPathname()).toBe('/reporte/nuevo');
    expect(screen.getByLabelText('Aula').props.value).toBe('B12');
    expect(screen.getByLabelText('Título').props.value).toBe('Ventana rota');
  });
});
