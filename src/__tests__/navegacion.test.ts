import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';

import { avisar } from '@/lib/avisar';
import { volver } from '@/lib/navegacion';

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('volver', () => {
  it('vuelve atrás si hay historial', () => {
    volver();

    expect(router.back).toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('sin historial va al inicio y no llama a back', () => {
    jest.mocked(router.canGoBack).mockReturnValueOnce(false);

    volver();

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/');
  });

  it('sin historial respeta el destino pedido', () => {
    jest.mocked(router.canGoBack).mockReturnValueOnce(false);

    volver('/reporte/nuevo');

    expect(router.replace).toHaveBeenCalledWith('/reporte/nuevo');
  });
});

describe('avisar', () => {
  const plataformaReal = Platform.OS;

  afterEach(() => {
    Platform.OS = plataformaReal;
  });

  it('en el celular usa Alert', () => {
    const alerta = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    avisar('Título', 'Mensaje');

    expect(alerta).toHaveBeenCalledWith('Título', 'Mensaje');
  });

  it('en web usa el aviso del navegador, porque Alert no muestra nada', () => {
    Platform.OS = 'web';
    const alerta = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    globalThis.alert = jest.fn();

    avisar('Título', 'Mensaje');

    expect(globalThis.alert).toHaveBeenCalledWith('Título\n\nMensaje');
    expect(alerta).not.toHaveBeenCalled();
  });
});
