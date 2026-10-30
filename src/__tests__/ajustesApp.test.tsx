import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import AjustesApp from '@/app/ajustes-app';
import { usePermiso } from '@/hooks/usePermiso';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock('@/hooks/usePermiso');

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

const ETIQUETA = 'Avisarme cuando se resuelva mi reporte';

function abrir(...args: Parameters<typeof permisoSimulado>) {
  const permiso = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(permiso);
  render(
    <Proveedores>
      <AjustesApp />
    </Proveedores>,
  );
  return permiso;
}

function interruptor() {
  return screen.getByRole('switch', { name: ETIQUETA });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Interruptor de avisos', () => {
  it('abrir la pantalla no pide nada', () => {
    const permiso = abrir('preguntable');

    expect(permiso.pedir).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
    expect(interruptor().props.value).toBe(false);
  });

  it('activarlo lleva a la pantalla previa de notificaciones', () => {
    abrir('preguntable');

    fireEvent(interruptor(), 'valueChange', true);

    expect(router.push).toHaveBeenCalledWith('/permisos/notificaciones');
  });

  it('con el permiso concedido se activa directo, sin pantalla previa', () => {
    abrir('concedido');

    fireEvent(interruptor(), 'valueChange', true);

    expect(router.push).not.toHaveBeenCalled();
    expect(interruptor().props.value).toBe(true);
  });

  it('apagarlo no pide nada y queda apagado', () => {
    abrir('concedido');
    fireEvent(interruptor(), 'valueChange', true);

    fireEvent(interruptor(), 'valueChange', false);

    expect(router.push).not.toHaveBeenCalled();
    expect(interruptor().props.value).toBe(false);
  });

  it('si no hay permiso, queda apagado y explica dónde llegan los avisos', () => {
    abrir('bloqueado');

    fireEvent(interruptor(), 'valueChange', true);

    expect(interruptor().props.value).toBe(false);
    expect(screen.getByText(/te esperan en la pestaña Avisos/)).toBeTruthy();
  });
});
