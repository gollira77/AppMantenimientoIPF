import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { textoUbicacion } from '@/lib/reportes/textoUbicacion';
import type { Ubicacion } from '@/lib/reportes/tipos';

function volver() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/reporte/nuevo');
  }
}

export default function UbicacionReporte() {
  const { estado, parcial, pedir, abrirAjustes } = usePermiso('ubicacion');
  const [denegadaAhora, setDenegadaAhora] = useState(false);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(false);
  const { actualizar } = useBorrador();

  async function continuar() {
    const nuevo = await pedir();
    setDenegadaAhora(nuevo !== 'concedido');
  }

  async function tomarUbicacion() {
    setBuscando(true);
    setError(false);
    try {
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUbicacion({
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        aproximada: parcial,
      });
    } catch {
      // GPS apagado, sin señal, etc. No es un error de permiso.
      setError(true);
    } finally {
      setBuscando(false);
    }
  }

  function usarUbicacion() {
    actualizar({ ubicacion });
    volver();
  }

  // 1. Cargando
  if (estado === 'cargando') {
    return <Cargando mensaje="Consultando el permiso de ubicación…" />;
  }

  // 2. Concedido
  if (estado === 'concedido') {
    return (
      <Pantalla>
        <Texto variante="titulo">Ubicación del desperfecto</Texto>
        {parcial ? (
          <Tarjeta>
            <Texto variante="subtitulo">Ubicación aproximada</Texto>
            <Texto variante="secundario">
              Compartiste tu ubicación aproximada (unos 3 km²). Alcanza para saber que estás en el
              instituto, pero no en qué sector.
            </Texto>
          </Tarjeta>
        ) : null}
        {ubicacion ? (
          <Tarjeta>
            <Texto variante="secundario">Ubicación tomada</Texto>
            <Texto>{textoUbicacion(ubicacion)}</Texto>
          </Tarjeta>
        ) : (
          <Texto>Parate cerca del desperfecto y tomá la ubicación.</Texto>
        )}
        {error ? (
          <Texto variante="secundario">
            No pudimos obtener la ubicación. Revisá que el GPS esté prendido y probá de nuevo.
          </Texto>
        ) : null}
        <Boton
          titulo={ubicacion ? 'Tomar de nuevo' : 'Tomar mi ubicación'}
          variante={ubicacion ? 'secundario' : 'primario'}
          cargando={buscando}
          onPress={tomarUbicacion}
        />
        {ubicacion ? <Boton titulo="Usar esta ubicación" onPress={usarUbicacion} /> : null}
      </Pantalla>
    );
  }

  // Se acaba de denegar: no insisto.
  if (denegadaAhora && estado === 'preguntable') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">Seguimos sin ubicación</Texto>
        <Texto>El reporte se puede enviar igual: con el aula alcanza para encontrarlo.</Texto>
        <Boton titulo="Volver al reporte" onPress={volver} />
      </Pantalla>
    );
  }

  // 3. Preguntable
  if (estado === 'preguntable') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">Agregar la ubicación</Texto>
        <Texto>
          Usamos tu ubicación para saber en qué sector del instituto está el desperfecto que
          reportás.
        </Texto>
        <Texto variante="secundario">Podés cambiar este permiso cuando quieras en Ajustes.</Texto>
        <Boton titulo="Continuar" onPress={continuar} />
      </Pantalla>
    );
  }

  // 4. Bloqueado
  return (
    <Pantalla centrada>
      <Texto variante="titulo">La ubicación está desactivada</Texto>
      <Texto>
        Para agregarla, habilitá la ubicación para esta app en Ajustes y volvé a esta pantalla. El
        reporte se puede enviar igual sin ubicación.
      </Texto>
      <Boton titulo="Abrir Ajustes" variante="secundario" onPress={abrirAjustes} />
      <Boton titulo="Volver al reporte" onPress={volver} />
    </Pantalla>
  );
}
