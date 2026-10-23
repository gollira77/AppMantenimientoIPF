import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function FotoReporte() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Foto del desperfecto</Texto>
      <Texto>Acá se saca o se elige la foto.</Texto>
    </Pantalla>
  );
}
