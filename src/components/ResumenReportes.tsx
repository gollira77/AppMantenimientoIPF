import { StyleSheet, Text, View } from 'react-native';

import { contarPorEstado } from '@/lib/reportes/resumen';
import type { Estado, Reporte } from '@/lib/reportes/tipos';
import { colores, espacio, tipografia } from '@/lib/tema';

const ETIQUETAS: { estado: Estado; etiqueta: string }[] = [
  { estado: 'pendiente', etiqueta: 'Pendientes' },
  { estado: 'en_proceso', etiqueta: 'En curso' },
  { estado: 'resuelto', etiqueta: 'Resueltos' },
];

type Props = {
  reportes: Reporte[];
};

export function ResumenReportes({ reportes }: Props) {
  const cuentas = contarPorEstado(reportes);

  return (
    <View style={estilos.fila}>
      {ETIQUETAS.map(({ estado, etiqueta }) => (
        <View
          key={estado}
          style={estilos.dato}
          accessible
          accessibilityLabel={`${etiqueta}: ${cuentas[estado]}`}>
          <Text style={estilos.numero}>{cuentas[estado]}</Text>
          <Text style={estilos.etiqueta}>{etiqueta}</Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espacio.s,
  },
  dato: {
    flex: 1,
  },
  numero: {
    ...tipografia.numero,
    color: colores.primarioTexto,
  },
  etiqueta: {
    ...tipografia.chico,
    color: colores.primarioTextoSuave,
  },
});
