import { StyleSheet, Text, View } from 'react-native';

export default function FotoReporte() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Foto del desperfecto</Text>
      <Text>Acá se saca o se elige la foto.</Text>
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
