import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Enlace } from '@/components/Enlace';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';
import { usePermiso } from '@/hooks/usePermiso';
import { esRecurso, TEXTOS_PREVIA, type Recurso } from '@/lib/permisos/previa';
import { colores, espacio } from '@/lib/tema';

const ICONOS: Record<Recurso, keyof typeof Ionicons.glyphMap> = {
  camara: 'camera',
  ubicacion: 'location',
  notificaciones: 'notifications',
};

function IconoRecurso({ recurso }: { recurso: Recurso }) {
  return (
    <View style={estilos.icono}>
      <Ionicons name={ICONOS[recurso]} size={44} color={colores.primarioTexto} />
    </View>
  );
}

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
        <IconoRecurso recurso={recurso} />
        <Texto variante="titulo">{titulo}</Texto>
        <Texto style={estilos.centrado}>{comoHabilitar}</Texto>
        <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />
      </Pantalla>
    );
  }

  // Un único botón: el "no" se le da al sistema, no a esta pantalla (pauta 5.1.1(iv) de Apple).
  // Apple tampoco admite salir sin ver el diálogo, así que saco el gesto y el botón atrás.
  return (
    <Pantalla centrada>
      <Stack.Screen options={{ gestureEnabled: false, headerBackVisible: false }} />
      <IconoRecurso recurso={recurso} />
      <Texto variante="titulo">{titulo}</Texto>
      <Texto style={estilos.centrado}>{beneficio}</Texto>
      <Texto variante="secundario" style={estilos.centrado}>
        Podés cambiar este permiso cuando quieras en Ajustes.
      </Texto>
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

const estilos = StyleSheet.create({
  icono: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.primario,
    borderWidth: 4,
    borderColor: colores.acento,
    marginBottom: espacio.s,
  },
  centrado: {
    textAlign: 'center',
  },
});
