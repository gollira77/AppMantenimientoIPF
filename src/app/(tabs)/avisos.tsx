import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function Avisos() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Avisos</Texto>
      <Texto>Acá vas a ver cuando se resuelva un reporte.</Texto>
    </Pantalla>
  );
}
