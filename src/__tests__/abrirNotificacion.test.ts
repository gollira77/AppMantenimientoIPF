import { renderHook } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

import { useAbrirNotificacion } from '@/hooks/useAbrirNotificacion';

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

function conRespuesta(data: Record<string, unknown>, accion?: string) {
  jest.mocked(Notifications.useLastNotificationResponse).mockReturnValue({
    actionIdentifier: accion ?? Notifications.DEFAULT_ACTION_IDENTIFIER,
    notification: { request: { content: { data } } },
  } as never);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tocar una notificación', () => {
  it('abre el reporte de la notificación', () => {
    conRespuesta({ reporteId: '7' });

    renderHook(() => useAbrirNotificacion());

    expect(router.push).toHaveBeenCalledWith('/reporte/7');
  });

  it('la olvida para no volver a abrirla al recargar', () => {
    conRespuesta({ reporteId: '7' });

    renderHook(() => useAbrirNotificacion());

    expect(Notifications.clearLastNotificationResponseAsync).toHaveBeenCalled();
  });

  it.each([undefined, null])('no hace nada si la respuesta es %p', (respuesta) => {
    jest.mocked(Notifications.useLastNotificationResponse).mockReturnValue(respuesta as never);

    renderHook(() => useAbrirNotificacion());

    expect(router.push).not.toHaveBeenCalled();
  });

  it('ignora una notificación sin reporteId', () => {
    conRespuesta({ otraCosa: true });

    renderHook(() => useAbrirNotificacion());

    expect(router.push).not.toHaveBeenCalled();
  });

  it('ignora una acción que no sea tocar la notificación', () => {
    conRespuesta({ reporteId: '7' }, 'descartar');

    renderHook(() => useAbrirNotificacion());

    expect(router.push).not.toHaveBeenCalled();
  });
});
