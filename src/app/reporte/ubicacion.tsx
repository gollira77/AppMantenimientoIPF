import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function UbicacionReporte() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Ubicación</Texto>
      <Texto>Acá se toma la ubicación o se elige el sector.</Texto>
    </Pantalla>
  );
}
