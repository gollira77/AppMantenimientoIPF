import { StyleSheet, Text, type TextProps } from 'react-native';

import { colores, tipografia } from '@/lib/tema';

type Variante = 'titulo' | 'subtitulo' | 'cuerpo' | 'secundario';

type Props = TextProps & {
  variante?: Variante;
};

export function Texto({ variante = 'cuerpo', style, ...props }: Props) {
  const esEncabezado = variante === 'titulo' || variante === 'subtitulo';
  return (
    <Text
      accessibilityRole={esEncabezado ? 'header' : undefined}
      style={[estilos[variante], style]}
      {...props}
    />
  );
}

const estilos = StyleSheet.create({
  titulo: { ...tipografia.titulo, color: colores.texto },
  subtitulo: { ...tipografia.subtitulo, color: colores.texto },
  cuerpo: { ...tipografia.cuerpo, color: colores.texto },
  secundario: { ...tipografia.chico, color: colores.textoSecundario },
});
