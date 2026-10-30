import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Aviso } from '@/lib/avisos/servicio';

type ValorAvisos = {
  avisos: Aviso[];
  noLeidos: number;
  agregar: (aviso: Aviso) => void;
  marcarLeido: (id: string) => void;
  marcarTodosLeidos: () => void;
};

const ContextoAvisos = createContext<ValorAvisos | null>(null);

export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const agregar = useCallback((aviso: Aviso) => {
    setAvisos((actuales) => [aviso, ...actuales]);
  }, []);

  const marcarLeido = useCallback((id: string) => {
    setAvisos((actuales) =>
      actuales.map((aviso) => (aviso.id === id ? { ...aviso, leido: true } : aviso)),
    );
  }, []);

  const marcarTodosLeidos = useCallback(() => {
    setAvisos((actuales) => actuales.map((aviso) => ({ ...aviso, leido: true })));
  }, []);

  const valor = useMemo(
    () => ({
      avisos,
      noLeidos: avisos.filter((aviso) => !aviso.leido).length,
      agregar,
      marcarLeido,
      marcarTodosLeidos,
    }),
    [avisos, agregar, marcarLeido, marcarTodosLeidos],
  );

  return <ContextoAvisos.Provider value={valor}>{children}</ContextoAvisos.Provider>;
}

export function useAvisos(): ValorAvisos {
  const valor = useContext(ContextoAvisos);
  if (!valor) {
    throw new Error('useAvisos tiene que usarse dentro de <ProveedorAvisos>.');
  }
  return valor;
}
