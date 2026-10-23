import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colores, espacio, radio } from '@/lib/tema';

type Props = {
  children: ReactNode;
};

export function Tarjeta({ children }: Props) {
  return <View style={estilos.tarjeta}>{children}</View>;
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: radio.m,
    padding: espacio.m,
    gap: espacio.s,
  },
});
