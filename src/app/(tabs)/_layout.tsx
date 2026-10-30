import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { useAvisos } from '@/hooks/useAvisos';
import { colores } from '@/lib/tema';

type NombreIcono = keyof typeof Ionicons.glyphMap;

function icono(nombre: NombreIcono) {
  function IconoTab({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={nombre} color={color} size={size} />;
  }
  return IconoTab;
}

export default function TabsLayout() {
  const { noLeidos } = useAvisos();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Reportes', tabBarIcon: icono('construct') }} />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          tabBarIcon: icono('notifications'),
          tabBarBadge: noLeidos > 0 ? noLeidos : undefined,
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{ title: 'Permisos', tabBarIcon: icono('shield-checkmark') }}
      />
    </Tabs>
  );
}
