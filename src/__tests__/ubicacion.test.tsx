import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Text } from 'react-native';

import UbicacionReporte from '@/app/reporte/ubicacion';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('@/hooks/usePermiso');

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), canGoBack: jest.fn(() => true), replace: jest.fn() },
}));

function conPermiso(...args: Parameters<typeof permisoSimulado>) {
  const simulado = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(simulado);
  return simulado;
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
});

describe('Ubicación: los cuatro estados', () => {
  it('pide el permiso de ubicación', () => {
    conPermiso('cargando');
    renderUbicacion();

    expect(usePermiso).toHaveBeenCalledWith('ubicacion');
    expect(screen.getByText('Consultando el permiso de ubicación…')).toBeTruthy();
  });

  it('2. concedido: toma la ubicación y la guarda en el borrador', async () => {
    conPermiso('concedido');
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
    conPermiso('concedido');
    jest.mocked(Location.getCurrentPositionAsync).mockRejectedValue(new Error('GPS apagado'));
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));

    await waitFor(() => expect(screen.getByText(/No pudimos obtener la ubicación/)).toBeTruthy());
  });

  it('3. preguntable: Continuar pide; si dice que no, se sigue sin ubicación', async () => {
    const permiso = conPermiso('preguntable');
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => expect(screen.getByText('Seguimos sin ubicación')).toBeTruthy());
    expect(permiso.pedir).toHaveBeenCalledTimes(1);
  });

  it('4. bloqueado: ofrece Abrir Ajustes y volver sin ubicación', () => {
    const permiso = conPermiso('bloqueado');
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Abrir Ajustes' }));
    fireEvent.press(screen.getByRole('button', { name: 'Volver al reporte' }));

    expect(permiso.abrirAjustes).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
    expect(permiso.pedir).not.toHaveBeenCalled();
  });
});

describe('Ubicación aproximada (M38)', () => {
  it('avisa que la ubicación es aproximada', () => {
    conPermiso('concedido', { parcial: true });
    renderUbicacion();

    expect(screen.getByText('Ubicación aproximada')).toBeTruthy();
  });

  it('con ubicación precisa no muestra el aviso', () => {
    conPermiso('concedido');
    renderUbicacion();

    expect(screen.queryByText('Ubicación aproximada')).toBeNull();
  });
});
