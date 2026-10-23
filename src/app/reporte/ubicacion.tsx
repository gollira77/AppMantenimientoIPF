import { StyleSheet, Text, View } from 'react-native';

export default function UbicacionReporte() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Ubicación</Text>
      <Text>Acá se toma la ubicación o se elige el sector.</Text>
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
