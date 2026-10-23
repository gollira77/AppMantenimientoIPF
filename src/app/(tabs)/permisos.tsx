import { StyleSheet, Text, View } from 'react-native';

export default function Permisos() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Permisos</Text>
      <Text>Acá vas a ver el estado de cada permiso de la app.</Text>
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
