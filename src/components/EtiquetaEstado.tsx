import { StyleSheet, Text, View } from 'react-native';

import { ETIQUETA_ESTADO, type Estado } from '@/lib/reportes/tipos';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

const COLOR_ESTADO: Record<Estado, string> = {
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
      style={[estilos.etiqueta, { borderColor: color }]}
      accessibilityLabel={`Estado: ${ETIQUETA_ESTADO[estado]}`}>
      <Text style={[estilos.texto, { color }]}>{ETIQUETA_ESTADO[estado]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radio.s,
    paddingHorizontal: espacio.s,
    paddingVertical: 2,
  },
  texto: {
    ...tipografia.chico,
    fontWeight: '600',
  },
});
