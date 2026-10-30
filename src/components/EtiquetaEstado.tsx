import { StyleSheet, Text, View } from 'react-native';

import { ETIQUETA_ESTADO, type Estado } from '@/lib/reportes/tipos';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

export const COLOR_ESTADO: Record<Estado, string> = {
  pendiente: colores.advertencia,
  en_proceso: colores.primario,
  resuelto: colores.exito,
};

type Props = {
  estado: Estado;
};

export function EtiquetaEstado({ estado }: Props) {
  const color = COLOR_ESTADO[estado];
  return (
    <View
      style={[estilos.etiqueta, { backgroundColor: color }]}
      accessibilityLabel={`Estado: ${ETIQUETA_ESTADO[estado]}`}>
      <Text style={estilos.texto}>{ETIQUETA_ESTADO[estado]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    borderRadius: radio.s,
    paddingHorizontal: espacio.s,
    paddingVertical: espacio.xs,
  },
  texto: {
    ...tipografia.chico,
    fontWeight: '700',
    color: colores.primarioTexto,
  },
});
