import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import DetalleReporte from '@/app/reporte/[id]';
import { usePermiso } from '@/hooks/usePermiso';
import { usePreferencias } from '@/hooks/usePreferencias';
import { configurarNotificaciones } from '@/lib/notificaciones/programar';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('@/hooks/usePermiso');

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

function abrir(estado: Parameters<typeof permisoSimulado>[0], quiereAvisos = true) {
  jest.mocked(usePermiso).mockReturnValue(permisoSimulado(estado));
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '1' });
  render(
    <Proveedores>
      {quiereAvisos ? <QuiereAvisos /> : null}
      <DetalleReporte />
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

  it('sin permiso no programa nada', async () => {
    abrir('bloqueado');

    simular();

    await screen.findByText('Resuelto');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('con el interruptor apagado no programa nada', async () => {
    abrir('concedido', false);

    simular();

    await screen.findByText('Resuelto');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
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
