import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { BORRADOR_VACIO, type Borrador } from '@/lib/reportes/borrador';

type ValorBorrador = {
  borrador: Borrador;
  actualizar: (cambios: Partial<Borrador>) => void;
  limpiar: () => void;
};

const ContextoBorrador = createContext<ValorBorrador | null>(null);

type Props = {
  children: ReactNode;
};

export function ProveedorBorrador({ children }: Props) {
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO);

  const actualizar = useCallback((cambios: Partial<Borrador>) => {
    setBorrador((actual) => ({ ...actual, ...cambios }));
  }, []);

  const limpiar = useCallback(() => setBorrador(BORRADOR_VACIO), []);

  const valor = useMemo(() => ({ borrador, actualizar, limpiar }), [borrador, actualizar, limpiar]);

  return <ContextoBorrador.Provider value={valor}>{children}</ContextoBorrador.Provider>;
}

export function useBorrador(): ValorBorrador {
  const valor = useContext(ContextoBorrador);
  if (!valor) {
    throw new Error('useBorrador tiene que usarse dentro de <ProveedorBorrador>.');
  }
  return valor;
}
