import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { CATEGORIAS, ETIQUETA_CATEGORIA, type Categoria } from '@/lib/reportes/tipos';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

type Props = {
  valor: Categoria | null;
  onCambiar: (categoria: Categoria) => void;
  error?: string;
};

export function SelectorCategoria({ valor, onCambiar, error }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Texto variante="subtitulo">Categoría</Texto>
      <View style={estilos.opciones} accessibilityRole="radiogroup">
        {CATEGORIAS.map((categoria) => {
          const elegida = categoria === valor;
          return (
            <Pressable
              key={categoria}
              accessibilityRole="radio"
              accessibilityState={{ checked: elegida }}
              accessibilityLabel={ETIQUETA_CATEGORIA[categoria]}
              onPress={() => onCambiar(categoria)}
              style={[estilos.opcion, elegida && estilos.elegida]}>
              <Text style={[estilos.texto, elegida && estilos.textoElegido]}>
                {ETIQUETA_CATEGORIA[categoria]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Texto variante="secundario" style={estilos.error}>
          {error}
        </Texto>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.xs,
  },
  opciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacio.s,
  },
  opcion: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacio.m,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  elegida: {
    borderColor: colores.primario,
    backgroundColor: colores.primario,
  },
  texto: {
    ...tipografia.cuerpo,
    color: colores.texto,
  },
  textoElegido: {
    color: colores.primarioTexto,
    fontWeight: '600',
  },
  error: {
    color: colores.peligro,
  },
});
