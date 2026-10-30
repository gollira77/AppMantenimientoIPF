import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { SECTORES, type Sector } from '@/lib/aulas/sectores';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

type Props = {
  valor: Sector | null;
  onElegir: (sector: Sector) => void;
};

/** Alternativa a la ubicación: elegir el sector del edificio de una lista. */
export function SelectorSector({ valor, onElegir }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Texto variante="subtitulo">¿En qué sector está?</Texto>
      <View accessibilityRole="radiogroup" style={estilos.lista}>
        {SECTORES.map((sector) => {
          const elegido = sector === valor;
          return (
            <Pressable
              key={sector}
              accessibilityRole="radio"
              accessibilityState={{ checked: elegido }}
              accessibilityLabel={sector}
              onPress={() => onElegir(sector)}
              style={[estilos.opcion, elegido && estilos.elegido]}>
              <Text style={[estilos.texto, elegido && estilos.textoElegido]}>{sector}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espacio.s,
  },
  lista: {
    gap: espacio.s,
  },
  opcion: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: espacio.m,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  elegido: {
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
});
