import { ActivityIndicator } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';
import { colores } from '@/lib/tema';

type Props = {
  mensaje: string;
};

export function Cargando({ mensaje }: Props) {
  return (
    <Pantalla centrada>
      <ActivityIndicator size="large" color={colores.primario} />
      <Texto accessibilityLiveRegion="polite">{mensaje}</Texto>
    </Pantalla>
  );
}
