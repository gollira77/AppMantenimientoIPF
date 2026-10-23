import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacio, radio, tipografia } from '@/lib/tema';

type Variante = 'primario' | 'secundario' | 'peligro';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  deshabilitado?: boolean;
  cargando?: boolean;
  /** Descripción para lectores de pantalla si el título solo no alcanza. */
  pista?: string;
};

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  pista,
}: Props) {
  const inactivo = deshabilitado || cargando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={pista}
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        fondos[variante],
        pressed && estilos.presionado,
        inactivo && estilos.inactivo,
      ]}>
      {cargando ? (
        <ActivityIndicator color={textos[variante].color} />
      ) : (
        <Text style={[estilos.texto, textos[variante]]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    borderRadius: radio.m,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  presionado: {
    opacity: 0.8,
  },
  inactivo: {
    opacity: 0.5,
  },
  texto: {
    ...tipografia.subtitulo,
  },
});

const fondos = StyleSheet.create({
  primario: {
    backgroundColor: colores.primario,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.primario,
  },
  peligro: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.peligro,
  },
});

const textos = StyleSheet.create({
  primario: { color: colores.primarioTexto },
  secundario: { color: colores.primario },
  peligro: { color: colores.peligro },
});
