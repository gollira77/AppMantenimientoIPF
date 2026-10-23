import { StyleSheet, Text, View } from 'react-native';

export default function AjustesApp() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Ajustes de la app</Text>
      <Text>Acá va el interruptor de avisos.</Text>
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
