import { Enlace } from '@/components/Enlace';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function Reportes() {
  return (
    <Pantalla centrada>
      <Texto variante="titulo">Mis reportes</Texto>
      <Texto>Todavía no cargaste ningún reporte.</Texto>
      <Enlace href="/reporte/nuevo">Nuevo reporte</Enlace>
      <Enlace href="/ajustes-app">Ajustes de la app</Enlace>
    </Pantalla>
  );
}
