import { Link, type Href } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colores, espacio, tipografia } from '@/lib/tema';

type Props = {
  href: Href;
  children: string;
};

export function Enlace({ href, children }: Props) {
  return (
    <Link href={href} style={estilos.enlace} accessibilityRole="link">
      {children}
    </Link>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    ...tipografia.cuerpo,
    color: colores.primario,
    paddingVertical: espacio.s,
    textDecorationLine: 'underline',
  },
});
