import { useEffect } from 'react';

let alEnfocar: (() => void) | null = null;

/**
 * Reemplazo de expo-router para probar una pantalla suelta. Para usar con
 * `jest.mock('expo-router', () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado)`.
 */
export const expoRouterSimulado = {
  router: {
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    push: jest.fn(),
    replace: jest.fn(),
  },
  useFocusEffect(efecto: () => void) {
    useEffect(() => {
      alEnfocar = efecto;
      efecto();
    }, [efecto]);
  },
};

/** La pantalla recupera el foco, como cuando se cierra el modal que tenía encima. */
export function volverAlFoco() {
  alEnfocar?.();
}
