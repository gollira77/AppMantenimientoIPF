import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Texto } from '@/components/Texto';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
  error?: string;
};

export function Campo({ etiqueta, error, multiline, ...props }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Texto variante="subtitulo">{etiqueta}</Texto>
      <TextInput
        accessibilityLabel={etiqueta}
        accessibilityHint={error}
        placeholderTextColor={colores.textoSecundario}
        multiline={multiline}
        style={[estilos.input, multiline && estilos.multilinea, error ? estilos.conError : null]}
        {...props}
      />
      {error ? (
        <Texto variante="secundario" style={estilos.error} accessibilityLiveRegion="polite">
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
  input: {
    ...tipografia.cuerpo,
    color: colores.texto,
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: radio.s,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    minHeight: 48,
  },
  multilinea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  conError: {
    borderColor: colores.peligro,
  },
  error: {
    color: colores.peligro,
  },
});
