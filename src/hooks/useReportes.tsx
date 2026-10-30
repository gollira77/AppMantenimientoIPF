import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { crearReporte } from '@/lib/reportes/crear';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';
import type { DatosReporte } from '@/lib/reportes/esquema';
import { repositorioAsyncStorage, type RepositorioReportes } from '@/lib/reportes/repositorio';
import type { Reporte } from '@/lib/reportes/tipos';

type ValorReportes = {
  reportes: Reporte[];
  /** Todavía se están leyendo los reportes guardados. */
  cargando: boolean;
  agregar: (datos: DatosReporte) => Reporte;
  resolver: (id: string) => void;
};

const ContextoReportes = createContext<ValorReportes | null>(null);

type Props = {
  children: ReactNode;
  /** Reportes fijos para un test: con ellos no se lee ni se guarda nada. */
  iniciales?: Reporte[];
  repositorio?: RepositorioReportes;
};

export function ProveedorReportes({
  children,
  iniciales,
  repositorio = repositorioAsyncStorage,
}: Props) {
  const persiste = iniciales === undefined;
  const [reportes, setReportes] = useState<Reporte[]>(iniciales ?? REPORTES_DE_PRUEBA);
  const [cargando, setCargando] = useState(persiste);

  useEffect(() => {
    if (!persiste) return;
    let vigente = true;
    repositorio.cargar().then((guardados) => {
      if (!vigente) return;
      if (guardados) setReportes(guardados);
      setCargando(false);
    });
    return () => {
      vigente = false;
    };
  }, [persiste, repositorio]);

  // Espero a terminar de cargar: si no, pisaría lo guardado con los datos iniciales.
  useEffect(() => {
    if (persiste && !cargando) void repositorio.guardar(reportes);
  }, [persiste, cargando, repositorio, reportes]);

  const agregar = useCallback((datos: DatosReporte) => {
    const nuevo = crearReporte(datos);
    // El más nuevo primero: es el que la persona quiere ver al volver a la lista.
    setReportes((actuales) => [nuevo, ...actuales]);
    return nuevo;
  }, []);

  const resolver = useCallback((id: string) => {
    setReportes((actuales) =>
      actuales.map((reporte) => (reporte.id === id ? { ...reporte, estado: 'resuelto' } : reporte)),
    );
  }, []);

  const valor = useMemo(
    () => ({ reportes, cargando, agregar, resolver }),
    [reportes, cargando, agregar, resolver],
  );

  return <ContextoReportes.Provider value={valor}>{children}</ContextoReportes.Provider>;
}

export function useReportes(): ValorReportes {
  const valor = useContext(ContextoReportes);
  if (!valor) {
    throw new Error('useReportes tiene que usarse dentro de <ProveedorReportes>.');
  }
  return valor;
}
