import { router, Stack, useLocalSearchParams } from 'expo-router';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Enlace } from '@/components/Enlace';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';
import { usePermiso } from '@/hooks/usePermiso';
import { esRecurso, TEXTOS_PREVIA, type Recurso } from '@/lib/permisos/previa';

function cerrar() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

function Previa({ recurso }: { recurso: Recurso }) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const { titulo, beneficio, comoHabilitar } = TEXTOS_PREVIA[recurso];

  async function continuar() {
    await pedir();
    cerrar();
  }

  if (estado === 'cargando') {
    return <Cargando mensaje="Consultando el permiso…" />;
  }

  // Bloqueado: el sistema ya no muestra el diálogo, así que "Continuar" no haría nada.
  if (estado === 'bloqueado') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">{titulo}</Texto>
        <Texto>{comoHabilitar}</Texto>
        <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />
      </Pantalla>
    );
  }

  // Un único botón: el "no" se le da al sistema, no a esta pantalla (pauta 5.1.1(iv) de Apple).
  // Apple tampoco admite salir sin ver el diálogo, así que saco el gesto y el botón atrás.
  return (
    <Pantalla centrada>
      <Stack.Screen options={{ gestureEnabled: false, headerBackVisible: false }} />
      <Texto variante="titulo">{titulo}</Texto>
      <Texto>{beneficio}</Texto>
      <Texto variante="secundario">Podés cambiar este permiso cuando quieras en Ajustes.</Texto>
      <Boton titulo="Continuar" onPress={continuar} />
    </Pantalla>
  );
}

export default function PantallaPrevia() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  if (!esRecurso(recurso)) {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">No conocemos ese permiso</Texto>
        <Enlace href="/permisos">Ver los permisos de la app</Enlace>
      </Pantalla>
    );
  }

  return <Previa recurso={recurso} />;
}
