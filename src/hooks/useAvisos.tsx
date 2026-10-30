import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Aviso } from '@/lib/avisos/servicio';

type ValorAvisos = {
  avisos: Aviso[];
  agregar: (aviso: Aviso) => void;
};

const ContextoAvisos = createContext<ValorAvisos | null>(null);

export function ProveedorAvisos({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const agregar = useCallback((aviso: Aviso) => {
    setAvisos((actuales) => [aviso, ...actuales]);
  }, []);

  const valor = useMemo(() => ({ avisos, agregar }), [avisos, agregar]);

  return <ContextoAvisos.Provider value={valor}>{children}</ContextoAvisos.Provider>;
}

export function useAvisos(): ValorAvisos {
  const valor = useContext(ContextoAvisos);
  if (!valor) {
    throw new Error('useAvisos tiene que usarse dentro de <ProveedorAvisos>.');
  }
  return valor;
}
