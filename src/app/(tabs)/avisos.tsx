import { StyleSheet, Text, View } from 'react-native';

export default function Avisos() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Avisos</Text>
      <Text>Acá vas a ver cuando se resuelva un reporte.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
