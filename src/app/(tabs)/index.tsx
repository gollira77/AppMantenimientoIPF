import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Reportes() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis reportes</Text>
      <Text>Todavía no cargaste ningún reporte.</Text>
      <Link href="/reporte/nuevo" style={styles.enlace}>
        Nuevo reporte
      </Link>
      <Link href="/ajustes-app" style={styles.enlace}>
        Ajustes de la app
      </Link>
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
  enlace: {
    color: '#1565C0',
    fontSize: 16,
    paddingVertical: 8,
  },
});
