import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
          </ProveedorBorrador>
        </ProveedorAvisos>
      </ProveedorReportes>
    </ProveedorPreferencias>
  );
}
