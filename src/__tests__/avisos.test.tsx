import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

import Avisos from '@/app/(tabs)/avisos';
import { useAvisos } from '@/hooks/useAvisos';
import type { Aviso } from '@/lib/avisos/servicio';
import { Proveedores } from '@/test-utils/Proveedores';

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

function aviso(id: string): Aviso {
  return {
    id,
    reporteId: id,
    mensaje: `Reporte ${id} resuelto`,
    creadoEn: '2026-10-30T12:00:00.000Z',
    leido: false,
  };
}

function ConAvisos({ ids }: { ids: string[] }) {
  const { agregar } = useAvisos();
  useEffect(() => ids.forEach((id) => agregar(aviso(id))), [ids, agregar]);
  return null;
}

function abrir(ids: string[]) {
  render(
    <Proveedores>
      <ConAvisos ids={ids} />
      <Avisos />
    </Proveedores>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Bandeja de avisos', () => {
  it('sin avisos, lo explica', () => {
    abrir([]);

    expect(screen.getByText(/el aviso va a estar acá/)).toBeTruthy();
    expect(screen.getByText('0 avisos sin leer')).toBeTruthy();
  });

  it('cuenta los avisos sin leer', () => {
    abrir(['1', '2']);

    expect(screen.getByText('2 avisos sin leer')).toBeTruthy();
  });

  it('tocar un aviso lo marca como leído y abre su reporte', () => {
    abrir(['1', '2']);

    fireEvent.press(screen.getByRole('button', { name: 'Sin leer. Reporte 1 resuelto' }));

    expect(router.push).toHaveBeenCalledWith('/reporte/1');
    expect(screen.getByText('1 aviso sin leer')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reporte 1 resuelto' })).toBeTruthy();
  });

  it('marca todos como leídos', () => {
    abrir(['1', '2']);

    fireEvent.press(screen.getByRole('button', { name: 'Marcar todos como leídos' }));

    expect(screen.getByText('0 avisos sin leer')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Marcar todos como leídos' })).toBeNull();
  });
});
