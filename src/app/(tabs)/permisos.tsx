import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function Permisos() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Permisos</Texto>
      <Texto>Acá vas a ver el estado de cada permiso de la app.</Texto>
    </Pantalla>
  );
}
