import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

type NombreIcono = keyof typeof Ionicons.glyphMap;

function icono(nombre: NombreIcono) {
  function IconoTab({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={nombre} color={color} size={size} />;
  }
  return IconoTab;
}

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Reportes', tabBarIcon: icono('construct') }} />
      <Tabs.Screen
        name="avisos"
        options={{ title: 'Avisos', tabBarIcon: icono('notifications') }}
      />
      <Tabs.Screen
        name="permisos"
        options={{ title: 'Permisos', tabBarIcon: icono('shield-checkmark') }}
      />
    </Tabs>
  );
}
