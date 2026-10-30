import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ValorPreferencias = {
  /** La persona activó el interruptor de avisos. No alcanza solo: también hace falta el permiso. */
  quiereAvisos: boolean;
  setQuiereAvisos: (valor: boolean) => void;
};

const ContextoPreferencias = createContext<ValorPreferencias | null>(null);

export function ProveedorPreferencias({ children }: { children: ReactNode }) {
  const [quiereAvisos, setQuiereAvisos] = useState(false);

  const valor = useMemo(() => ({ quiereAvisos, setQuiereAvisos }), [quiereAvisos]);

  return <ContextoPreferencias.Provider value={valor}>{children}</ContextoPreferencias.Provider>;
}

export function usePreferencias(): ValorPreferencias {
  const valor = useContext(ContextoPreferencias);
  if (!valor) {
    throw new Error('usePreferencias tiene que usarse dentro de <ProveedorPreferencias>.');
  }
  return valor;
}
