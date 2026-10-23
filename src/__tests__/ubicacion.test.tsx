import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Linking, Text } from 'react-native';

import UbicacionReporte from '@/app/reporte/ubicacion';
import { useBorrador } from '@/hooks/useBorrador';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn() },
}));

const pedir = jest.fn();

function respuesta(
  status: Location.PermissionStatus,
  granted: boolean,
  canAskAgain: boolean,
): Location.LocationPermissionResponse {
  return { status, granted, canAskAgain, expires: 'never' };
}

function conPermiso(permiso: Location.LocationPermissionResponse | null) {
  jest.mocked(Location.useForegroundPermissions).mockReturnValue([permiso, pedir, jest.fn()]);
}

function UbicacionDelBorrador() {
  const { borrador } = useBorrador();
  return <Text>borrador: {JSON.stringify(borrador.ubicacion)}</Text>;
}

function renderUbicacion() {
  return render(
    <Proveedores>
      <UbicacionReporte />
      <UbicacionDelBorrador />
    </Proveedores>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  pedir.mockResolvedValue(respuesta(Location.PermissionStatus.DENIED, false, true));
});

describe('Ubicación: los cuatro estados', () => {
  it('1. cargando', () => {
    conPermiso(null);
    renderUbicacion();

    expect(screen.getByText('Consultando el permiso de ubicación…')).toBeTruthy();
  });

  it('2. concedido: toma la ubicación y la guarda en el borrador', async () => {
    conPermiso(respuesta(Location.PermissionStatus.GRANTED, true, true));
    jest.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: { latitude: -26.18489, longitude: -58.17313 },
    } as Location.LocationObject);
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));
    await waitFor(() => expect(screen.getByText('-26.18489, -58.17313')).toBeTruthy());
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta ubicación' }));

    expect(screen.getByText('borrador: {"latitud":-26.18489,"longitud":-58.17313}')).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('2. concedido: si el GPS falla, avisa sin romperse', async () => {
    conPermiso(respuesta(Location.PermissionStatus.GRANTED, true, true));
    jest.mocked(Location.getCurrentPositionAsync).mockRejectedValue(new Error('GPS apagado'));
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));

    await waitFor(() => expect(screen.getByText(/No pudimos obtener la ubicación/)).toBeTruthy());
  });

  it('3. preguntable: Continuar pide; si dice que no, se sigue sin ubicación', async () => {
    conPermiso(respuesta(Location.PermissionStatus.UNDETERMINED, false, true));
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => expect(screen.getByText('Seguimos sin ubicación')).toBeTruthy());
    expect(pedir).toHaveBeenCalledTimes(1);
  });

  it('4. bloqueado: ofrece Abrir Ajustes y volver sin ubicación', () => {
    const abrirAjustes = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    conPermiso(respuesta(Location.PermissionStatus.DENIED, false, false));
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Abrir Ajustes' }));
    fireEvent.press(screen.getByRole('button', { name: 'Volver al reporte' }));

    expect(abrirAjustes).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
    expect(pedir).not.toHaveBeenCalled();
  });
});
