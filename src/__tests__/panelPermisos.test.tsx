import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { act } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import Permisos from '@/app/(tabs)/permisos';
import { vaciarDiario } from '@/lib/permisos/diario';

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

const concedido = { status: 'granted', granted: true, canAskAgain: true, expires: 'never' };
const sinDecidir = { status: 'undetermined', granted: false, canAskAgain: true, expires: 'never' };
const bloqueado = { status: 'denied', granted: false, canAskAgain: false, expires: 'never' };

const consultarCamara = jest.mocked(Camera.getCameraPermissionsAsync);
const consultarUbicacion = jest.mocked(Location.getForegroundPermissionsAsync);

beforeEach(() => {
  jest.clearAllMocks();
  vaciarDiario();
  consultarCamara.mockResolvedValue(concedido as never);
  consultarUbicacion.mockResolvedValue(sinDecidir as never);
});

describe('Panel de permisos', () => {
  it('muestra cada recurso con su estado y la plataforma', async () => {
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText('Concedido')).toBeTruthy());
    expect(screen.getByText('Sin decidir')).toBeTruthy();
    expect(screen.getByText('Plataforma: ios')).toBeTruthy();
  });

  it('la galería figura como no requerida', async () => {
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText('Concedido')).toBeTruthy());
    expect(screen.getByText('no requerida (selector del sistema)')).toBeTruthy();
  });

  it('muestra el matiz de la ubicación aproximada', async () => {
    consultarUbicacion.mockResolvedValue({
      ...concedido,
      android: { accuracy: 'coarse' },
    } as never);
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText('accuracy: coarse')).toBeTruthy());
  });

  it('solo consulta: abrir el panel no pide ningún permiso', async () => {
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText('Concedido')).toBeTruthy());
    expect(Camera.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('Activar lleva a la pantalla previa del recurso', async () => {
    render(<Permisos />);

    fireEvent.press(await screen.findByRole('button', { name: 'Activar' }));

    expect(router.push).toHaveBeenCalledWith('/permisos/ubicacion');
  });

  it('muestra el diario con lo que se consultó', async () => {
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText(/consulta · camara → Concedido/)).toBeTruthy());
    expect(screen.getByText(/consulta · ubicacion → Sin decidir/)).toBeTruthy();
  });

  it('si está bloqueado, ofrece ver cómo habilitarlo', async () => {
    consultarCamara.mockResolvedValue(bloqueado as never);
    render(<Permisos />);

    await waitFor(() => expect(screen.getByText('Bloqueado')).toBeTruthy());
    fireEvent.press(screen.getByRole('button', { name: 'Cómo habilitarlo' }));

    expect(router.push).toHaveBeenCalledWith('/permisos/camara');
  });

  it('se actualiza al volver de Ajustes', async () => {
    const oyentes = new Set<(estado: AppStateStatus) => void>();
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_tipo, oyente) => {
      oyentes.add(oyente);
      return { remove: () => oyentes.delete(oyente) };
    });
    consultarCamara.mockResolvedValue(bloqueado as never);
    render(<Permisos />);
    await waitFor(() => expect(screen.getByText('Bloqueado')).toBeTruthy());

    consultarCamara.mockResolvedValue(concedido as never);
    await act(async () => {
      oyentes.forEach((oyente) => oyente('active'));
    });

    expect(screen.getByText('Concedido')).toBeTruthy();
  });
});
