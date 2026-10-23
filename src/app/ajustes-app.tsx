import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function AjustesApp() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Ajustes de la app</Texto>
      <Texto>Acá va el interruptor de avisos.</Texto>
    </Pantalla>
  );
}
