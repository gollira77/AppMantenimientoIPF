import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { usePermiso } from '@/hooks/usePermiso';
import { crearSistemaSimulado, type Plataforma } from '@/test-utils/sistemaSimulado';

// Parte D4: el ciclo completo de un permiso de ubicación, corrido con el hook real
// sobre un sistema operativo simulado con las reglas de Android 14 y de iOS.

function prepararSistema(plataforma: Plataforma) {
  const sistema = crearSistemaSimulado(plataforma);
  jest
    .mocked(Location.getForegroundPermissionsAsync)
    .mockImplementation(sistema.consultar as never);
  jest
    .mocked(Location.requestForegroundPermissionsAsync)
    .mockImplementation(sistema.pedir as never);
  return sistema;
}

async function pedirYMedir(
  sistema: ReturnType<typeof crearSistemaSimulado>,
  hook: { current: ReturnType<typeof usePermiso> },
) {
  const antes = sistema.dialogosMostrados;
  await act(async () => {
    await hook.current.pedir();
  });
  return {
    status: hook.current.respuesta?.status,
    canAskAgain: hook.current.respuesta?.canAskAgain,
    dialogo: sistema.dialogosMostrados > antes,
  };
}

describe('D4 en Android 14', () => {
  it('reproduce la tabla paso a paso', async () => {
    const sistema = prepararSistema('android');
    const { result } = renderHook(() => usePermiso('ubicacion'));

    // 1. getForegroundPermissionsAsync(): sin decidir, sin diálogo.
    await waitFor(() => expect(result.current.estado).toBe('preguntable'));
    expect(result.current.respuesta).toMatchObject({ status: 'undetermined', canAskAgain: true });
    expect(sistema.dialogosMostrados).toBe(0);

    // 2. request → "No permitir": denegado, todavía se puede volver a pedir.
    sistema.laPersonaVaAContestar('no permitir');
    expect(await pedirYMedir(sistema, result)).toEqual({
      status: 'denied',
      canAskAgain: true,
      dialogo: true,
    });

    // 3. request → "No permitir" otra vez: Android 11+ lo toma como "no volver a preguntar".
    sistema.laPersonaVaAContestar('no permitir');
    expect(await pedirYMedir(sistema, result)).toEqual({
      status: 'denied',
      canAskAgain: false,
      dialogo: true,
    });
    expect(result.current.estado).toBe('bloqueado');

    // 4. request de nuevo: el sistema contesta "no" sin mostrar nada.
    expect(await pedirYMedir(sistema, result)).toEqual({
      status: 'denied',
      canAskAgain: false,
      dialogo: false,
    });

    // 6. La persona habilita en Ajustes pero la app NO vuelve a consultar: sigue diciendo bloqueado.
    sistema.habilitarDesdeAjustes();
    expect(result.current.estado).toBe('bloqueado');

    // 5. La app vuelve a consultar al volver: ahora está concedido, sin diálogo.
    await act(async () => {
      await result.current.consultar();
    });
    expect(result.current.respuesta).toMatchObject({ status: 'granted', canAskAgain: true });
    expect(result.current.estado).toBe('concedido');
    expect(sistema.dialogosMostrados).toBe(2);
  });
});

describe('D4 en iOS', () => {
  it('el primer "No permitir" ya bloquea: cambia en el paso 2', async () => {
    const sistema = prepararSistema('ios');
    const { result } = renderHook(() => usePermiso('ubicacion'));

    await waitFor(() => expect(result.current.estado).toBe('preguntable'));

    sistema.laPersonaVaAContestar('no permitir');
    expect(await pedirYMedir(sistema, result)).toEqual({
      status: 'denied',
      canAskAgain: false,
      dialogo: true,
    });
    expect(result.current.estado).toBe('bloqueado');

    // 3 y 4: ya no hay diálogo.
    expect((await pedirYMedir(sistema, result)).dialogo).toBe(false);
    expect((await pedirYMedir(sistema, result)).dialogo).toBe(false);
    expect(sistema.dialogosMostrados).toBe(1);
  });
});
