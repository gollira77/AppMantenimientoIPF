import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

import { usePermiso } from '@/hooks/usePermiso';

const concedido = { status: 'granted', granted: true, canAskAgain: true, expires: 'never' };
const sinDecidir = { status: 'undetermined', granted: false, canAskAgain: true, expires: 'never' };
const denegado = { status: 'denied', granted: false, canAskAgain: true, expires: 'never' };
const bloqueado = { status: 'denied', granted: false, canAskAgain: false, expires: 'never' };

const consultarCamara = jest.mocked(Camera.getCameraPermissionsAsync);
const pedirCamara = jest.mocked(Camera.requestCameraPermissionsAsync);
const consultarUbicacion = jest.mocked(Location.getForegroundPermissionsAsync);
const pedirUbicacion = jest.mocked(Location.requestForegroundPermissionsAsync);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePermiso', () => {
  it('arranca cargando y después muestra lo que dice el sistema', async () => {
    consultarCamara.mockResolvedValue(concedido as never);
    const { result } = renderHook(() => usePermiso('camara'));

    expect(result.current.estado).toBe('cargando');
    await waitFor(() => expect(result.current.estado).toBe('concedido'));
  });

  it('al montar solo consulta: nunca muestra el diálogo', async () => {
    consultarCamara.mockResolvedValue(sinDecidir as never);
    const { result } = renderHook(() => usePermiso('camara'));

    await waitFor(() => expect(result.current.estado).toBe('preguntable'));
    expect(pedirCamara).not.toHaveBeenCalled();
  });

  it('usa el módulo de Expo que corresponde a cada recurso', async () => {
    consultarUbicacion.mockResolvedValue(bloqueado as never);
    const { result } = renderHook(() => usePermiso('ubicacion'));

    await waitFor(() => expect(result.current.estado).toBe('bloqueado'));
    expect(consultarUbicacion).toHaveBeenCalled();
    expect(consultarCamara).not.toHaveBeenCalled();
  });

  it('pedir() muestra el diálogo y devuelve el estado nuevo', async () => {
    consultarCamara.mockResolvedValue(sinDecidir as never);
    pedirCamara.mockResolvedValue(concedido as never);
    const { result } = renderHook(() => usePermiso('camara'));
    await waitFor(() => expect(result.current.estado).toBe('preguntable'));

    let nuevo: string | undefined;
    await act(async () => {
      nuevo = await result.current.pedir();
    });

    expect(pedirCamara).toHaveBeenCalledTimes(1);
    expect(nuevo).toBe('concedido');
    expect(result.current.estado).toBe('concedido');
  });

  it('el segundo "no" en Android deja el permiso bloqueado', async () => {
    consultarUbicacion.mockResolvedValue(denegado as never);
    pedirUbicacion.mockResolvedValue(bloqueado as never);
    const { result } = renderHook(() => usePermiso('ubicacion'));
    await waitFor(() => expect(result.current.estado).toBe('preguntable'));

    await act(async () => {
      await result.current.pedir();
    });

    expect(result.current.estado).toBe('bloqueado');
  });

  it('consultar() relee el estado sin pedir', async () => {
    consultarCamara.mockResolvedValueOnce(bloqueado as never);
    const { result } = renderHook(() => usePermiso('camara'));
    await waitFor(() => expect(result.current.estado).toBe('bloqueado'));

    consultarCamara.mockResolvedValueOnce(concedido as never);
    await act(async () => {
      await result.current.consultar();
    });

    expect(result.current.estado).toBe('concedido');
    expect(pedirCamara).not.toHaveBeenCalled();
  });

  it('abrirAjustes() abre los Ajustes de la app', async () => {
    const abrir = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    consultarCamara.mockResolvedValue(bloqueado as never);
    const { result } = renderHook(() => usePermiso('camara'));
    await waitFor(() => expect(result.current.estado).toBe('bloqueado'));

    await act(async () => {
      await result.current.abrirAjustes();
    });

    expect(abrir).toHaveBeenCalled();
  });

  it('expone la respuesta cruda del sistema', async () => {
    consultarCamara.mockResolvedValue(bloqueado as never);
    const { result } = renderHook(() => usePermiso('camara'));

    await waitFor(() => expect(result.current.respuesta).toEqual(bloqueado));
  });
});

describe('usePermiso: matiz parcial', () => {
  it('marca parcial la ubicación aproximada de Android', async () => {
    consultarUbicacion.mockResolvedValue({
      ...concedido,
      android: { accuracy: 'coarse' },
    } as never);
    const { result } = renderHook(() => usePermiso('ubicacion'));

    await waitFor(() => expect(result.current.estado).toBe('concedido'));
    expect(result.current.parcial).toBe(true);
  });

  it('marca parcial la ubicación aproximada de iOS', async () => {
    consultarUbicacion.mockResolvedValue({ ...concedido, ios: { accuracy: 'reduced' } } as never);
    const { result } = renderHook(() => usePermiso('ubicacion'));

    await waitFor(() => expect(result.current.parcial).toBe(true));
  });

  it('la ubicación precisa no es parcial', async () => {
    consultarUbicacion.mockResolvedValue({ ...concedido, android: { accuracy: 'fine' } } as never);
    const { result } = renderHook(() => usePermiso('ubicacion'));

    await waitFor(() => expect(result.current.estado).toBe('concedido'));
    expect(result.current.parcial).toBe(false);
  });
});
