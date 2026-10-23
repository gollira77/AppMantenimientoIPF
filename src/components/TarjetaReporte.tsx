import { Pressable, StyleSheet, View } from 'react-native';

import { EtiquetaEstado } from '@/components/EtiquetaEstado';
import { Texto } from '@/components/Texto';
import { ETIQUETA_CATEGORIA, ETIQUETA_ESTADO, type Reporte } from '@/lib/reportes/tipos';
import { colores, espacio, radio } from '@/lib/tema';

type Props = {
  reporte: Reporte;
  onPress: () => void;
};

export function TarjetaReporte({ reporte, onPress }: Props) {
  const categoria = ETIQUETA_CATEGORIA[reporte.categoria];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${reporte.titulo}. Aula ${reporte.aula}. ${categoria}. ${ETIQUETA_ESTADO[reporte.estado]}`}
      accessibilityHint="Abre el detalle del reporte"
      onPress={onPress}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
      <View style={estilos.encabezado}>
        <Texto variante="subtitulo" style={estilos.titulo}>
          {reporte.titulo}
        </Texto>
        <EtiquetaEstado estado={reporte.estado} />
      </View>
      <Texto variante="secundario">
        Aula {reporte.aula} · {categoria}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: radio.m,
    padding: espacio.m,
    gap: espacio.xs,
  },
  presionada: {
    opacity: 0.8,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
  },
  titulo: {
    flex: 1,
  },
});
