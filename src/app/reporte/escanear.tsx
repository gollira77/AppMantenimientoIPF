import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function EscanearAula() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Escanear aula</Texto>
      <Texto>Acá va el escáner del QR del aula.</Texto>
    </Pantalla>
  );
}
