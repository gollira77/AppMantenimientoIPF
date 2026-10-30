import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

import DetalleReporte from '@/app/reporte/[id]';
import { useAvisos } from '@/hooks/useAvisos';
import { usePreferencias } from '@/hooks/usePreferencias';
import { avisarResolucion, crearAviso } from '@/lib/avisos/servicio';
import { configurarNotificaciones } from '@/lib/notificaciones/programar';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('expo-router', () => ({
  ...jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
  useLocalSearchParams: jest.fn(),
  Link: () => null,
}));

/** Prende el interruptor de avisos, como si la persona lo hubiera hecho en /ajustes-app. */
function QuiereAvisos() {
  const { setQuiereAvisos } = usePreferencias();
  useEffect(() => setQuiereAvisos(true), [setQuiereAvisos]);
  return null;
}

function Bandeja() {
  const { avisos } = useAvisos();
  return <Text>bandeja: {avisos.length}</Text>;
}

const RESPUESTAS = {
  concedido: { status: 'granted', granted: true, canAskAgain: true, expires: 'never' },
  bloqueado: { status: 'denied', granted: false, canAskAgain: false, expires: 'never' },
};

function abrir(estado: keyof typeof RESPUESTAS, quiereAvisos = true) {
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue(RESPUESTAS[estado] as never);
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '1' });
  render(
    <Proveedores>
      {quiereAvisos ? <QuiereAvisos /> : null}
      <DetalleReporte />
      <Bandeja />
    </Proveedores>,
  );
}

function simular() {
  fireEvent.press(screen.getByRole('button', { name: 'Simular resolución' }));
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Simular resolución', () => {
  it('programa una notificación local a los 10 segundos en el canal reportes', async () => {
    abrir('concedido');

    simular();

    await waitFor(() => expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled());
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({ data: { reporteId: '1' } }),
        trigger: { type: 'timeInterval', seconds: 10, channelId: 'reportes' },
      }),
    );
    expect(await screen.findByText(/en 10 segundos/)).toBeTruthy();
  });

  it('marca el reporte como resuelto y saca el botón', async () => {
    abrir('concedido');

    simular();

    expect(await screen.findByText('Resuelto')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Simular resolución' })).toBeNull();
  });

  it('sin permiso, el aviso va a la bandeja', async () => {
    abrir('bloqueado');

    simular();

    expect(await screen.findByText('El aviso quedó en la pestaña Avisos.')).toBeTruthy();
    expect(screen.getByText('bandeja: 1')).toBeTruthy();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('con el interruptor apagado, el aviso va a la bandeja', async () => {
    abrir('concedido', false);

    simular();

    expect(await screen.findByText('bandeja: 1')).toBeTruthy();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('avisarResolucion', () => {
  const reporte = REPORTES_DE_PRUEBA[0]!;

  it('si programar falla, el aviso no se pierde', async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue(RESPUESTAS.concedido as never);
    jest.mocked(Notifications.scheduleNotificationAsync).mockRejectedValueOnce(new Error('falló'));
    const agregarABandeja = jest.fn();

    const destino = await avisarResolucion(reporte, { quiereAvisos: true, agregarABandeja });

    expect(destino).toBe('bandeja');
    expect(agregarABandeja).toHaveBeenCalledTimes(1);
  });

  it('no consulta el permiso si la persona no quiere avisos', async () => {
    await avisarResolucion(reporte, { quiereAvisos: false, agregarABandeja: jest.fn() });

    expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
  });

  it('crearAviso arma un aviso sin leer con el reporte y la fecha', () => {
    const ahora = new Date('2026-10-30T12:00:00.000Z');

    expect(crearAviso(reporte, ahora)).toMatchObject({
      reporteId: reporte.id,
      creadoEn: ahora.toISOString(),
      leido: false,
    });
  });
});

describe('Notificaciones con la app abierta', () => {
  it('el manejador muestra la notificación con los campos vigentes', async () => {
    configurarNotificaciones();

    const manejador = jest.mocked(Notifications.setNotificationHandler).mock.calls[0]?.[0];
    const comportamiento = await manejador?.handleNotification({} as never);

    expect(comportamiento).toMatchObject({ shouldShowBanner: true, shouldShowList: true });
  });
});
