import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Enlace } from '@/components/Enlace';
import { EtiquetaEstado } from '@/components/EtiquetaEstado';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { useAvisos } from '@/hooks/useAvisos';
import { usePreferencias } from '@/hooks/usePreferencias';
import { useReportes } from '@/hooks/useReportes';
import { avisarResolucion } from '@/lib/avisos/servicio';
import { SEGUNDOS_AVISO } from '@/lib/notificaciones/programar';
import { buscarReporte } from '@/lib/reportes/buscar';
import { textoUbicacion } from '@/lib/reportes/textoUbicacion';
import { ETIQUETA_CATEGORIA } from '@/lib/reportes/tipos';
import { radio } from '@/lib/tema';

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reportes, cargando, resolver } = useReportes();
  const { agregar: agregarABandeja } = useAvisos();
  const { quiereAvisos } = usePreferencias();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const busqueda = buscarReporte(reportes, id);

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
    // Al abrir desde una notificación, los reportes guardados pueden no haber llegado todavía.
    if (cargando) return <Cargando mensaje="Buscando el reporte…" />;

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

  async function simularResolucion() {
    resolver(reporte.id);
    const destino = await avisarResolucion(reporte, { quiereAvisos, agregarABandeja });
    setMensaje(
      destino === 'notificacion'
        ? `Te llega una notificación en ${SEGUNDOS_AVISO} segundos.`
        : 'El aviso quedó en la pestaña Avisos.',
    );
  }

  return (
    <Pantalla>
      <Texto variante="titulo">{reporte.titulo}</Texto>
      <EtiquetaEstado estado={reporte.estado} />
      {reporte.fotoUri ? (
        <Image
          source={{ uri: reporte.fotoUri }}
          style={estilos.foto}
          accessibilityLabel={`Foto del reporte ${reporte.titulo}`}
          resizeMode="cover"
        />
      ) : null}
      <Tarjeta>
        <Texto variante="secundario">Aula</Texto>
        <Texto>{reporte.aula}</Texto>
        <Texto variante="secundario">Categoría</Texto>
        <Texto>{ETIQUETA_CATEGORIA[reporte.categoria]}</Texto>
        {reporte.ubicacion ? (
          <>
            <Texto variante="secundario">Ubicación</Texto>
            <Texto>{textoUbicacion(reporte.ubicacion)}</Texto>
          </>
        ) : null}
        {reporte.sector ? (
          <>
            <Texto variante="secundario">Sector</Texto>
            <Texto>{reporte.sector}</Texto>
          </>
        ) : null}
        <Texto variante="secundario">Creado</Texto>
        <Texto>{formatoFecha.format(new Date(reporte.creadoEn))}</Texto>
      </Tarjeta>
      <Tarjeta>
        <Texto variante="secundario">Descripción</Texto>
        <Texto>{reporte.descripcion}</Texto>
      </Tarjeta>
      {mensaje ? <Texto variante="secundario">{mensaje}</Texto> : null}
      {reporte.estado === 'resuelto' ? null : (
        <Boton
          titulo="Simular resolución"
          variante="secundario"
          pista="Marca el reporte como resuelto, como si lo hiciera el personal del instituto"
          onPress={simularResolucion}
        />
      )}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  foto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radio.m,
  },
});
