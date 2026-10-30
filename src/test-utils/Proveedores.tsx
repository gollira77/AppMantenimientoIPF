import type { ReactNode } from 'react';

import { ProveedorAvisos } from '@/hooks/useAvisos';
import { ProveedorBorrador } from '@/hooks/useBorrador';
import { ProveedorPreferencias } from '@/hooks/usePreferencias';
import { ProveedorReportes } from '@/hooks/useReportes';

/** Los mismos proveedores que el layout raíz, para renderizar una pantalla suelta en un test. */
export function Proveedores({ children }: { children: ReactNode }) {
  return (
    <ProveedorPreferencias>
      <ProveedorReportes>
        <ProveedorAvisos>
          <ProveedorBorrador>{children}</ProveedorBorrador>
        </ProveedorAvisos>
      </ProveedorReportes>
    </ProveedorPreferencias>
  );
}
