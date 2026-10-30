import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { z } from 'zod';

import { ProveedorAvisos, useAvisos } from '@/hooks/useAvisos';
import { ProveedorBorrador, useBorrador } from '@/hooks/useBorrador';
import { ProveedorPreferencias, usePreferencias } from '@/hooks/usePreferencias';
import { ProveedorReportes, useReportes } from '@/hooks/useReportes';
import { escribirGuardado, leerGuardado } from '@/lib/persistencia/almacen';
import {
  crearRepositorioEnMemoria,
  repositorioAsyncStorage,
  type RepositorioReportes,
} from '@/lib/reportes/repositorio';
import type { Reporte } from '@/lib/reportes/tipos';

const leerItem = jest.mocked(AsyncStorage.getItem);
const escribirItem = jest.mocked(AsyncStorage.setItem);

const guardado: Reporte = {
  id: 'abc',
  titulo: 'Silla rota',
  descripcion: 'La silla de la primera fila tiene una pata floja.',
  aula: 'A3',
  categoria: 'mobiliario',
  estado: 'pendiente',
  creadoEn: '2026-10-30T12:00:00.000Z',
};

const datos = {
  titulo: 'Puerta trabada',
  descripcion: 'La puerta del aula no cierra del todo.',
  aula: 'B12',
  categoria: 'mobiliario' as const,
};

function Titulos() {
  const { reportes, cargando } = useReportes();
  return <Text>{cargando ? 'cargando' : reportes.map((r) => r.titulo).join(', ')}</Text>;
}

function conRepositorio(repositorio: RepositorioReportes) {
  function Envoltorio({ children }: { children: ReactNode }) {
    return <ProveedorReportes repositorio={repositorio}>{children}</ProveedorReportes>;
  }
  return Envoltorio;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Repositorio en memoria', () => {
  it('sin nada guardado devuelve null', async () => {
    expect(await crearRepositorioEnMemoria().cargar()).toBeNull();
  });

  it('devuelve lo que se guardó', async () => {
    const repositorio = crearRepositorioEnMemoria();

    await repositorio.guardar([guardado]);

    expect(await repositorio.cargar()).toEqual([guardado]);
  });
});

describe('ProveedorReportes con repositorio', () => {
  it('muestra lo guardado en lugar de los datos iniciales', async () => {
    render(
      <ProveedorReportes repositorio={crearRepositorioEnMemoria([guardado])}>
        <Titulos />
      </ProveedorReportes>,
    );

    expect(await screen.findByText('Silla rota')).toBeTruthy();
  });

  it('un reporte nuevo sobrevive a cerrar y abrir la app', async () => {
    const repositorio = crearRepositorioEnMemoria([guardado]);
    const { result, unmount } = renderHook(() => useReportes(), {
      wrapper: conRepositorio(repositorio),
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));

    act(() => {
      result.current.agregar(datos);
    });
    await waitFor(async () => expect(await repositorio.cargar()).toHaveLength(2));
    unmount();

    render(
      <ProveedorReportes repositorio={repositorio}>
        <Titulos />
      </ProveedorReportes>,
    );

    expect(await screen.findByText('Puerta trabada, Silla rota')).toBeTruthy();
  });

  it('el estado resuelto también se guarda', async () => {
    const repositorio = crearRepositorioEnMemoria([guardado]);
    const { result } = renderHook(() => useReportes(), { wrapper: conRepositorio(repositorio) });
    await waitFor(() => expect(result.current.cargando).toBe(false));

    act(() => result.current.resolver('abc'));

    await waitFor(async () => expect((await repositorio.cargar())?.[0]?.estado).toBe('resuelto'));
  });

  it('no pisa lo guardado mientras todavía está cargando', async () => {
    const repositorio = crearRepositorioEnMemoria([guardado]);
    const guardar = jest.spyOn(repositorio, 'guardar');
    render(
      <ProveedorReportes repositorio={repositorio}>
        <Titulos />
      </ProveedorReportes>,
    );

    expect(guardar).not.toHaveBeenCalled();
    await screen.findByText('Silla rota');
  });
});

describe('usePreferencias', () => {
  it('setQuiereAvisos no cambia de identidad al cambiar el valor', async () => {
    leerItem.mockResolvedValueOnce(null);
    const { result } = renderHook(() => usePreferencias(), { wrapper: ProveedorPreferencias });
    const antes = result.current.setQuiereAvisos;

    act(() => result.current.setQuiereAvisos(true));

    await waitFor(() => expect(result.current.quiereAvisos).toBe(true));
    expect(result.current.setQuiereAvisos).toBe(antes);
  });
});

describe('Lo guardado es una entrada externa', () => {
  const esquema = z.object({ nombre: z.string() });

  it('un JSON roto no rompe la app', async () => {
    leerItem.mockResolvedValueOnce('{esto no es json');

    expect(await leerGuardado('clave', esquema)).toBeNull();
  });

  it('un formato viejo se ignora', async () => {
    leerItem.mockResolvedValueOnce(JSON.stringify({ nombre: 42 }));

    expect(await leerGuardado('clave', esquema)).toBeNull();
  });

  it('si el almacenamiento falla al leer, sigue', async () => {
    leerItem.mockRejectedValueOnce(new Error('sin espacio'));

    expect(await leerGuardado('clave', esquema)).toBeNull();
  });

  it('si el almacenamiento falla al guardar, sigue', async () => {
    escribirItem.mockRejectedValueOnce(new Error('sin espacio'));

    await expect(escribirGuardado('clave', 1)).resolves.toBeUndefined();
  });

  it('el repositorio real rechaza un reporte con un estado que no existe', async () => {
    leerItem.mockResolvedValueOnce(JSON.stringify([{ ...guardado, estado: 'perdido' }]));

    expect(await repositorioAsyncStorage.cargar()).toBeNull();
  });

  it('el repositorio real lee un reporte válido', async () => {
    leerItem.mockResolvedValueOnce(JSON.stringify([guardado]));

    expect(await repositorioAsyncStorage.cargar()).toEqual([guardado]);
  });
});

describe('Avisos, borrador y preferencias persistidos', () => {
  it('recupera los avisos guardados', async () => {
    const aviso = {
      id: '1',
      reporteId: '1',
      mensaje: 'Listo',
      creadoEn: '2026-10-30T12:00:00.000Z',
      leido: false,
    };
    leerItem.mockResolvedValueOnce(JSON.stringify([aviso]));

    const { result } = renderHook(() => useAvisos(), { wrapper: ProveedorAvisos });

    await waitFor(() => expect(result.current.noLeidos).toBe(1));
  });

  it('recupera el borrador a medio escribir', async () => {
    leerItem.mockResolvedValueOnce(
      JSON.stringify({
        titulo: 'Enchu',
        descripcion: '',
        aula: '',
        categoria: null,
        ubicacion: null,
        sector: null,
        fotoUri: null,
      }),
    );

    const { result } = renderHook(() => useBorrador(), { wrapper: ProveedorBorrador });

    await waitFor(() => expect(result.current.borrador.titulo).toBe('Enchu'));
  });

  it('guarda cada cambio del borrador después de cargar', async () => {
    leerItem.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useBorrador(), { wrapper: ProveedorBorrador });
    await waitFor(() => expect(escribirItem).toHaveBeenCalled());

    act(() => result.current.actualizar({ aula: 'B12' }));

    await waitFor(() =>
      expect(escribirItem).toHaveBeenLastCalledWith(
        'mantenimiento-ipf/borrador/v1',
        expect.stringContaining('"aula":"B12"'),
      ),
    );
  });

  it('recuerda el interruptor de avisos', async () => {
    leerItem.mockResolvedValueOnce(JSON.stringify({ quiereAvisos: true }));

    const { result } = renderHook(() => usePreferencias(), { wrapper: ProveedorPreferencias });

    await waitFor(() => expect(result.current.quiereAvisos).toBe(true));
  });
});
