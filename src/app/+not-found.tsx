import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NoEncontrada() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrada' }} />
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Esta pantalla no existe</Text>
        <Text>Puede que el enlace esté mal escrito o que la pantalla se haya movido.</Text>
        <Link href="/" style={styles.enlace}>
          Volver a mis reportes
        </Link>
      </View>
    </>
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
  enlace: {
    color: '#1565C0',
    fontSize: 16,
    paddingVertical: 8,
  },
});
