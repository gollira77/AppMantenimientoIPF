import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { leerDiario, vaciarDiario } from '@/lib/permisos/diario';
import { RECURSOS, TEXTOS_PREVIA } from '@/lib/permisos/previa';
import { consultarTodos, REGISTRO } from '@/lib/permisos/registro';

const concedido = { status: 'granted', granted: true, canAskAgain: true, expires: 'never' };
const bloqueado = { status: 'denied', granted: false, canAskAgain: false, expires: 'never' };

beforeEach(() => {
  jest.clearAllMocks();
  vaciarDiario();
});

describe('Registro de permisos', () => {
  it('tiene una entrada y textos para cada recurso', () => {
    expect(Object.keys(REGISTRO).sort()).toEqual([...RECURSOS].sort());
    expect(Object.keys(TEXTOS_PREVIA).sort()).toEqual([...RECURSOS].sort());
  });

  it('consultarTodos devuelve la respuesta de cada recurso', async () => {
    jest.mocked(Camera.getCameraPermissionsAsync).mockResolvedValue(concedido as never);
    jest.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(bloqueado as never);
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue(concedido as never);

    const respuestas = await consultarTodos();

    expect(respuestas.camara).toEqual(concedido);
    expect(respuestas.ubicacion).toEqual(bloqueado);
  });

  it('anota cada consulta y cada pedido en el diario', async () => {
    jest.mocked(Camera.getCameraPermissionsAsync).mockResolvedValue(bloqueado as never);
    jest.mocked(Camera.requestCameraPermissionsAsync).mockResolvedValue(concedido as never);

    await REGISTRO.camara.consultar();
    await REGISTRO.camara.pedir();

    expect(leerDiario().map((e) => [e.recurso, e.accion, e.resultado])).toEqual([
      ['camara', 'pedido', 'concedido'],
      ['camara', 'consulta', 'bloqueado'],
    ]);
  });

  it('consultarTodos nunca muestra un diálogo', async () => {
    jest.mocked(Camera.getCameraPermissionsAsync).mockResolvedValue(concedido as never);
    jest.mocked(Location.getForegroundPermissionsAsync).mockResolvedValue(concedido as never);
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue(concedido as never);

    await consultarTodos();

    expect(Camera.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe('Registro: canal de notificaciones (M57)', () => {
  const plataformaReal = Platform.OS;

  afterEach(() => {
    Platform.OS = plataformaReal;
  });

  it('en Android crea el canal reportes antes de pedir el permiso', async () => {
    Platform.OS = 'android';
    const orden: string[] = [];
    jest.mocked(Notifications.setNotificationChannelAsync).mockImplementation(async () => {
      orden.push('canal');
      return null;
    });
    jest.mocked(Notifications.requestPermissionsAsync).mockImplementation(async () => {
      orden.push('pedido');
      return concedido as never;
    });

    await REGISTRO.notificaciones.pedir();

    expect(orden).toEqual(['canal', 'pedido']);
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      'reportes',
      expect.objectContaining({ name: 'Reportes' }),
    );
  });

  it('en iOS no hay canales: pide directamente', async () => {
    Platform.OS = 'ios';
    jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue(concedido as never);

    await REGISTRO.notificaciones.pedir();

    expect(Notifications.setNotificationChannelAsync).not.toHaveBeenCalled();
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  });

  it('consultar no crea el canal: leer no tiene efectos', async () => {
    Platform.OS = 'android';
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue(concedido as never);

    await REGISTRO.notificaciones.consultar();

    expect(Notifications.setNotificationChannelAsync).not.toHaveBeenCalled();
  });
});
