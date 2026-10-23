import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function NuevoReporte() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Nuevo reporte</Texto>
      <Texto>Acá va el formulario del reporte.</Texto>
    </Pantalla>
  );
}
