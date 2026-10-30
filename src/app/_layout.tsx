import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';

import { useAbrirNotificacion } from '@/hooks/useAbrirNotificacion';
import { ProveedorAvisos } from '@/hooks/useAvisos';
import { ProveedorBorrador } from '@/hooks/useBorrador';
import { ProveedorPreferencias } from '@/hooks/usePreferencias';
import { ProveedorReportes } from '@/hooks/useReportes';
import { configurarNotificaciones } from '@/lib/notificaciones/programar';
import { colores } from '@/lib/tema';

configurarNotificaciones();

export default function RootLayout() {
  useAbrirNotificacion();

  return (
    <ProveedorPreferencias>
      <ProveedorReportes>
        <ProveedorAvisos>
          <ProveedorBorrador>
            <StatusBar style="light" />
            <View style={estilos.exterior}>
              <View style={estilos.columna}>
                <Stack
                  screenOptions={{
                    headerStyle: { backgroundColor: colores.primario },
                    headerTintColor: colores.primarioTexto,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: colores.fondo },
                  }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
                  <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear aula' }} />
                  <Stack.Screen name="reporte/foto" options={{ title: 'Foto' }} />
                  <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación' }} />
                  <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle del reporte' }} />
                  <Stack.Screen name="ajustes-app" options={{ title: 'Ajustes de la app' }} />
                  <Stack.Screen name="herramientas/qr" options={{ title: 'Generador de QR' }} />
                  <Stack.Screen
                    name="permisos/[recurso]"
                    options={{ presentation: 'modal', title: 'Antes de continuar' }}
                  />
                </Stack>
              </View>
            </View>
          </ProveedorBorrador>
        </ProveedorAvisos>
      </ProveedorReportes>
    </ProveedorPreferencias>
  );
}

const estilos = StyleSheet.create({
  exterior: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colores.primario,
  },
  // En una pantalla de compu, la app se ve como una columna centrada, no estirada.
  columna: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : undefined,
    backgroundColor: colores.fondo,
  },
});
