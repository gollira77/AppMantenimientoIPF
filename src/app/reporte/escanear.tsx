import { StyleSheet, Text, View } from 'react-native';

export default function EscanearAula() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Escanear aula</Text>
      <Text>Acá va el escáner del QR del aula.</Text>
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
