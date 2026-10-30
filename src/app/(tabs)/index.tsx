import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Enlace } from '@/components/Enlace';
import { ResumenReportes } from '@/components/ResumenReportes';
import { TarjetaReporte } from '@/components/TarjetaReporte';
import { Texto } from '@/components/Texto';
import { useReportes } from '@/hooks/useReportes';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

export default function Reportes() {
  const { reportes } = useReportes();

  return (
    <View style={estilos.fondo}>
      <FlatList
        data={reportes}
        keyExtractor={(reporte) => reporte.id}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <View style={estilos.encabezado}>
            <View style={estilos.portada}>
              <Text style={estilos.instituto}>Instituto Politécnico Formosa</Text>
              <Texto variante="titulo" style={estilos.tituloPortada}>
                Mis reportes
              </Texto>
              <ResumenReportes reportes={reportes} />
              <Boton titulo="Nuevo reporte" onPress={() => router.push('/reporte/nuevo')} />
            </View>
            <Enlace href="/ajustes-app">Ajustes de la app</Enlace>
            <Enlace href="/herramientas/qr">Generador de QR de aulas</Enlace>
          </View>
        }
        ListEmptyComponent={<Texto>Todavía no cargaste ningún reporte.</Texto>}
        renderItem={({ item }) => (
          <TarjetaReporte reporte={item} onPress={() => router.push(`/reporte/${item.id}`)} />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: espacio.m,
    gap: espacio.s,
  },
  encabezado: {
    gap: espacio.s,
    marginBottom: espacio.s,
  },
  portada: {
    backgroundColor: colores.primario,
    borderRadius: radio.l,
    borderBottomWidth: 6,
    borderBottomColor: colores.acento,
    padding: espacio.l,
    gap: espacio.m,
  },
  instituto: {
    ...tipografia.chico,
    color: colores.primarioTextoSuave,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tituloPortada: {
    fontSize: 28,
    color: colores.primarioTexto,
  },
});
