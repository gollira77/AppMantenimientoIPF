import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Text } from 'react-native';

import UbicacionReporte from '@/app/reporte/ubicacion';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';
import { volverAlFoco } from '@/test-utils/routerSimulado';

jest.mock('@/hooks/usePermiso');

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

function conPermiso(...args: Parameters<typeof permisoSimulado>) {
  const simulado = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(simulado);
  return simulado;
}

function UbicacionDelBorrador() {
  const { borrador } = useBorrador();
  return (
    <>
      <Text>borrador: {JSON.stringify(borrador.ubicacion)}</Text>
      <Text>sector: {borrador.sector ?? '(ninguno)'}</Text>
    </>
  );
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

    expect(
      screen.getByText('borrador: {"latitud":-26.18489,"longitud":-58.17313,"aproximada":false}'),
    ).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('2. concedido: si el GPS falla, avisa sin romperse', async () => {
    conPermiso('concedido');
    jest.mocked(Location.getCurrentPositionAsync).mockRejectedValue(new Error('GPS apagado'));
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));

    await waitFor(() => expect(screen.getByText(/No pudimos obtener la ubicación/)).toBeTruthy());
  });

  it('3. preguntable: abre la pantalla previa y deja seguir sin ubicación', () => {
    const permiso = conPermiso('preguntable');
    renderUbicacion();

    expect(router.push).toHaveBeenCalledWith('/permisos/ubicacion');
    expect(permiso.pedir).not.toHaveBeenCalled();
    expect(screen.getByText('Seguimos sin ubicación')).toBeTruthy();
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

describe('Ubicación: no insistir después de un no (M52)', () => {
  it('al volver del modal con un no, la pantalla previa no aparece sola', () => {
    conPermiso('preguntable');
    renderUbicacion();

    volverAlFoco();

    expect(router.push).toHaveBeenCalledTimes(1);
  });

  it('vuelve a aparecer si la persona toca Usar mi ubicación', () => {
    conPermiso('preguntable');
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Usar mi ubicación' }));

    expect(router.push).toHaveBeenCalledTimes(2);
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

describe('Coordenadas ocultas si es aproximada (M39)', () => {
  beforeEach(() => {
    jest.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: { latitude: -26.18489, longitude: -58.17313 },
    } as Location.LocationObject);
  });

  it('con ubicación aproximada no muestra las coordenadas y la guarda marcada', async () => {
    conPermiso('concedido', { parcial: true });
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));
    await waitFor(() => expect(screen.getByText('Ubicación tomada')).toBeTruthy());

    expect(screen.queryByText(/-26.18489/)).toBeNull();
    fireEvent.press(screen.getByRole('radio', { name: 'Biblioteca' }));
    expect(screen.getByText(/"aproximada":true/)).toBeTruthy();
    expect(screen.getByText('sector: Biblioteca')).toBeTruthy();
  });

  it('con ubicación precisa sí muestra las coordenadas', async () => {
    conPermiso('concedido');
    renderUbicacion();

    fireEvent.press(screen.getByRole('button', { name: 'Tomar mi ubicación' }));

    await waitFor(() => expect(screen.getByText('-26.18489, -58.17313')).toBeTruthy());
  });
});

describe('Sector elegido a mano (M40)', () => {
  it('si no hay permiso, ofrece elegir el sector', () => {
    conPermiso('preguntable');
    renderUbicacion();

    fireEvent.press(screen.getByRole('radio', { name: 'Primer piso · Laboratorios' }));

    expect(screen.getByText('sector: Primer piso · Laboratorios')).toBeTruthy();
    expect(screen.getByText('borrador: null')).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('si la ubicación está bloqueada, también se elige el sector', () => {
    conPermiso('bloqueado');
    renderUbicacion();

    fireEvent.press(screen.getByRole('radio', { name: 'Patio y exteriores' }));

    expect(screen.getByText('sector: Patio y exteriores')).toBeTruthy();
  });

  it('con ubicación precisa no hace falta elegir sector', () => {
    conPermiso('concedido');
    renderUbicacion();

    expect(screen.queryByRole('radio')).toBeNull();
  });
});
