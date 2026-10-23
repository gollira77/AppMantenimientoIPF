import type { RespuestaPermiso } from '@/lib/permisos/interpretar';

export type Plataforma = 'android' | 'ios';
export type Contestacion = 'permitir' | 'no permitir';

/**
 * Un sistema operativo de juguete con las reglas de los diálogos de permisos:
 * - Android 11+: el segundo "No permitir" bloquea (canAskAgain pasa a false).
 * - iOS: el diálogo aparece una sola vez; el primer "No permitir" ya bloquea.
 * - Si está bloqueado, request() contesta "denegado" sin mostrar el diálogo.
 */
export function crearSistemaSimulado(plataforma: Plataforma) {
  let status: 'undetermined' | 'granted' | 'denied' = 'undetermined';
  let canAskAgain = true;
  let rechazos = 0;
  let dialogosMostrados = 0;
  const contestaciones: Contestacion[] = [];

  const respuesta = (): RespuestaPermiso => ({
    status,
    granted: status === 'granted',
    canAskAgain,
  });

  return {
    /** La próxima vez que aparezca el diálogo, la persona contesta esto. */
    laPersonaVaAContestar(contestacion: Contestacion) {
      contestaciones.push(contestacion);
    },
    async consultar() {
      return respuesta();
    },
    async pedir() {
      if (status === 'granted' || !canAskAgain) return respuesta();

      dialogosMostrados += 1;
      const contestacion = contestaciones.shift() ?? 'no permitir';
      if (contestacion === 'permitir') {
        status = 'granted';
      } else {
        status = 'denied';
        rechazos += 1;
        const limite = plataforma === 'ios' ? 1 : 2;
        if (rechazos >= limite) canAskAgain = false;
      }
      return respuesta();
    },
    /** La persona entra a Ajustes y habilita el permiso a mano. */
    habilitarDesdeAjustes() {
      status = 'granted';
      canAskAgain = true;
    },
    get dialogosMostrados() {
      return dialogosMostrados;
    },
  };
}
