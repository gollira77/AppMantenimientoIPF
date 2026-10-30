import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import { RECURSOS, TEXTOS_PREVIA } from '@/lib/permisos/previa';
import { consultarTodos, REGISTRO } from '@/lib/permisos/registro';

const concedido = { status: 'granted', granted: true, canAskAgain: true, expires: 'never' };
const bloqueado = { status: 'denied', granted: false, canAskAgain: false, expires: 'never' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Registro de permisos', () => {
  it('tiene una entrada y textos para cada recurso', () => {
    expect(Object.keys(REGISTRO).sort()).toEqual([...RECURSOS].sort());
    expect(Object.keys(TEXTOS_PREVIA).sort()).toEqual([...RECURSOS].sort());
  });

  it('consultarTodos devuelve la respuesta de cada recurso', async () => {
    jest.mocked(Camera.getCameraPermissionsAsync).mockResolvedValue(concedido as never);
    jest.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(bloqueado as never);

    const respuestas = await consultarTodos();

    expect(respuestas.camara).toEqual(concedido);
    expect(respuestas.ubicacion).toEqual(bloqueado);
  });

  it('consultarTodos nunca muestra un diálogo', async () => {
    jest.mocked(Camera.getCameraPermissionsAsync).mockResolvedValue(concedido as never);
    jest.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(concedido as never);

    await consultarTodos();

    expect(Camera.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });
});
