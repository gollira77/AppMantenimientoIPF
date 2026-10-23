import { useLocalSearchParams } from 'expo-router';

import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Pantalla centrada>
      <Texto variante="titulo">Reporte {id}</Texto>
      <Texto>Acá va el detalle del reporte.</Texto>
    </Pantalla>
  );
}
