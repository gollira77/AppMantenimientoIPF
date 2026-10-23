import { StyleSheet, Text, View } from 'react-native';

export default function NuevoReporte() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Nuevo reporte</Text>
      <Text>Acá va el formulario del reporte.</Text>
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
