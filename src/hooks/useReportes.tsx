import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { crearReporte } from '@/lib/reportes/crear';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';
import type { DatosReporte } from '@/lib/reportes/esquema';
import type { Reporte } from '@/lib/reportes/tipos';

type ValorReportes = {
  reportes: Reporte[];
  agregar: (datos: DatosReporte) => Reporte;
};

const ContextoReportes = createContext<ValorReportes | null>(null);

type Props = {
  children: ReactNode;
  /** Reportes iniciales; en los tests se pueden reemplazar. */
  iniciales?: Reporte[];
};

export function ProveedorReportes({ children, iniciales = REPORTES_DE_PRUEBA }: Props) {
  const [reportes, setReportes] = useState<Reporte[]>(iniciales);

  const agregar = useCallback((datos: DatosReporte) => {
    const nuevo = crearReporte(datos);
    // El más nuevo primero: es el que la persona quiere ver al volver a la lista.
    setReportes((actuales) => [nuevo, ...actuales]);
    return nuevo;
  }, []);

  const valor = useMemo(() => ({ reportes, agregar }), [reportes, agregar]);

  return <ContextoReportes.Provider value={valor}>{children}</ContextoReportes.Provider>;
}

export function useReportes(): ValorReportes {
  const valor = useContext(ContextoReportes);
  if (!valor) {
    throw new Error('useReportes tiene que usarse dentro de <ProveedorReportes>.');
  }
  return valor;
}
