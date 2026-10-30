import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { usePersistido } from '@/hooks/usePersistido';
import { esquemaPreferencias } from '@/lib/persistencia/esquemas';

type ValorPreferencias = {
  /** La persona activó el interruptor de avisos. No alcanza solo: también hace falta el permiso. */
  quiereAvisos: boolean;
  setQuiereAvisos: (valor: boolean) => void;
};

const ContextoPreferencias = createContext<ValorPreferencias | null>(null);

export function ProveedorPreferencias({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState({ quiereAvisos: false });
  usePersistido(
    'mantenimiento-ipf/preferencias/v1',
    esquemaPreferencias,
    preferencias,
    setPreferencias,
  );

  // Estable: si cambiara con cada valor, un efecto que la use se dispararía sin parar.
  const setQuiereAvisos = useCallback((quiereAvisos: boolean) => {
    setPreferencias({ quiereAvisos });
  }, []);

  const valor = useMemo(
    () => ({ quiereAvisos: preferencias.quiereAvisos, setQuiereAvisos }),
    [preferencias, setQuiereAvisos],
  );

  return <ContextoPreferencias.Provider value={valor}>{children}</ContextoPreferencias.Provider>;
}

export function usePreferencias(): ValorPreferencias {
  const valor = useContext(ContextoPreferencias);
  if (!valor) {
    throw new Error('usePreferencias tiene que usarse dentro de <ProveedorPreferencias>.');
  }
  return valor;
}
