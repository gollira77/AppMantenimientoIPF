import type { ResultadoPermiso } from '@/hooks/usePermiso';
import type { EstadoPermiso } from '@/lib/permisos/interpretar';

/**
 * Arma lo que devolvería usePermiso en un estado dado. Para usar con
 * `jest.mock('@/hooks/usePermiso')` y `jest.mocked(usePermiso).mockReturnValue(...)`.
 */
export function permisoSimulado(
  estado: EstadoPermiso,
  cambios: Partial<ResultadoPermiso> = {},
): ResultadoPermiso {
  return {
    estado,
    parcial: false,
    respuesta: null,
    // Por defecto, en el diálogo la persona contesta "No permitir".
    pedir: jest.fn().mockResolvedValue('preguntable'),
    consultar: jest.fn().mockResolvedValue(estado),
    abrirAjustes: jest.fn().mockResolvedValue(undefined),
    ...cambios,
  };
}
