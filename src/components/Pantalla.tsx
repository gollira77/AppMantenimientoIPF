import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colores, espacio } from '@/lib/tema';

type Props = {
  children: ReactNode;
  /** Centra el contenido; útil para pantallas de mensaje. */
  centrada?: boolean;
  /** Sin scroll, por ejemplo cuando la pantalla tiene una lista o la cámara. */
  sinScroll?: boolean;
};

export function Pantalla({ children, centrada = false, sinScroll = false }: Props) {
  const contenido = [estilos.contenido, centrada && estilos.centrada];

  if (sinScroll) {
    return <View style={[estilos.fondo, ...contenido]}>{children}</View>;
  }

  return (
    <ScrollView
      style={estilos.fondo}
      contentContainerStyle={contenido}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    flexGrow: 1,
    padding: espacio.m,
    gap: espacio.m,
  },
  centrada: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
