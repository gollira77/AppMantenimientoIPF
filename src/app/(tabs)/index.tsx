import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Enlace } from '@/components/Enlace';
import { TarjetaReporte } from '@/components/TarjetaReporte';
import { Texto } from '@/components/Texto';
import { useReportes } from '@/hooks/useReportes';
import { colores, espacio } from '@/lib/tema';

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
            <Texto variante="titulo">Mis reportes</Texto>
            <Boton titulo="Nuevo reporte" onPress={() => router.push('/reporte/nuevo')} />
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
});
