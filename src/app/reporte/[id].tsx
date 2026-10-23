import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Reporte {id}</Text>
      <Text>Acá va el detalle del reporte.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
