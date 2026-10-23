import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function GeneradorQr() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Generador de QR</Texto>
      <Texto>Acá se generan los QR de cada aula.</Texto>
    </Pantalla>
  );
}
