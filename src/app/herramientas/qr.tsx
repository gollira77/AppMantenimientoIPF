import { StyleSheet, Text, View } from 'react-native';

export default function GeneradorQr() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Generador de QR</Text>
      <Text>Acá se generan los QR de cada aula.</Text>
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
