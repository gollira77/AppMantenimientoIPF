import { useLocalSearchParams } from 'expo-router';

import { Enlace } from '@/components/Enlace';
import { EtiquetaEstado } from '@/components/EtiquetaEstado';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { buscarReporte } from '@/lib/reportes/buscar';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';
import { ETIQUETA_CATEGORIA } from '@/lib/reportes/tipos';

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const busqueda = buscarReporte(REPORTES_DE_PRUEBA, id);

  if (busqueda.tipo === 'invalido') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">El enlace no es válido</Texto>
        <Texto>El número de reporte tiene caracteres que no reconocemos.</Texto>
        <Enlace href="/">Volver a mis reportes</Enlace>
      </Pantalla>
    );
  }

  if (busqueda.tipo === 'no_encontrado') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">No encontramos el reporte</Texto>
        <Texto>
          No hay ningún reporte con el número {busqueda.id}. Puede que se haya borrado o que el
          enlace sea viejo.
        </Texto>
        <Enlace href="/">Volver a mis reportes</Enlace>
      </Pantalla>
    );
  }

  const { reporte } = busqueda;
  return (
    <Pantalla>
      <Texto variante="titulo">{reporte.titulo}</Texto>
      <EtiquetaEstado estado={reporte.estado} />
      <Tarjeta>
        <Texto variante="secundario">Aula</Texto>
        <Texto>{reporte.aula}</Texto>
        <Texto variante="secundario">Categoría</Texto>
        <Texto>{ETIQUETA_CATEGORIA[reporte.categoria]}</Texto>
        <Texto variante="secundario">Creado</Texto>
        <Texto>{formatoFecha.format(new Date(reporte.creadoEn))}</Texto>
      </Tarjeta>
      <Tarjeta>
        <Texto variante="secundario">Descripción</Texto>
        <Texto>{reporte.descripcion}</Texto>
      </Tarjeta>
    </Pantalla>
  );
}
