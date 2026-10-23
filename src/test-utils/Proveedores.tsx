import type { ReactNode } from 'react';

import { ProveedorBorrador } from '@/hooks/useBorrador';
import { ProveedorReportes } from '@/hooks/useReportes';

/** Los mismos proveedores que el layout raíz, para renderizar una pantalla suelta en un test. */
export function Proveedores({ children }: { children: ReactNode }) {
  return (
    <ProveedorReportes>
      <ProveedorBorrador>{children}</ProveedorBorrador>
    </ProveedorReportes>
  );
}
