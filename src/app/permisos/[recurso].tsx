import { useLocalSearchParams } from 'expo-router';

import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function PantallaPrevia() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  return (
    <Pantalla centrada>
      <Texto variante="titulo">Permiso: {recurso}</Texto>
      <Texto>Acá va la explicación previa al diálogo del sistema.</Texto>
    </Pantalla>
  );
}
