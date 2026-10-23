import { Stack } from 'expo-router';

import { ProveedorBorrador } from '@/hooks/useBorrador';
import { ProveedorReportes } from '@/hooks/useReportes';
import { colores } from '@/lib/tema';

export default function RootLayout() {
  return (
    <ProveedorReportes>
      <ProveedorBorrador>
        <Stack
          screenOptions={{
            headerTintColor: colores.primario,
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
    </ProveedorReportes>
  );
}
