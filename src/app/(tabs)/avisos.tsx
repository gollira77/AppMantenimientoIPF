import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Texto } from '@/components/Texto';
import { useAvisos } from '@/hooks/useAvisos';
import type { Aviso } from '@/lib/avisos/servicio';
import { colores, espacio, radio } from '@/lib/tema';

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export default function Avisos() {
  const { avisos, noLeidos, marcarLeido, marcarTodosLeidos } = useAvisos();

  function abrir(aviso: Aviso) {
    marcarLeido(aviso.id);
    router.push(`/reporte/${aviso.reporteId}`);
  }

  return (
    <View style={estilos.fondo}>
      <FlatList
        data={avisos}
        keyExtractor={(aviso) => aviso.id}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <View style={estilos.encabezado}>
            <Texto variante="titulo">Avisos</Texto>
            <Texto variante="secundario">
              {noLeidos === 1 ? '1 aviso sin leer' : `${noLeidos} avisos sin leer`}
            </Texto>
            {noLeidos > 0 ? (
              <Boton
                titulo="Marcar todos como leídos"
                variante="secundario"
                onPress={marcarTodosLeidos}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <Texto>
            Cuando se resuelva un reporte y no pueda notificarte, el aviso va a estar acá.
          </Texto>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.leido ? '' : 'Sin leer. '}${item.mensaje}`}
            accessibilityHint="Abre el reporte"
            onPress={() => abrir(item)}
            style={[estilos.aviso, !item.leido && estilos.sinLeer]}>
            <Texto variante={item.leido ? 'cuerpo' : 'subtitulo'}>{item.mensaje}</Texto>
            <Texto variante="secundario">{formatoFecha.format(new Date(item.creadoEn))}</Texto>
          </Pressable>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: espacio.m,
    gap: espacio.s,
  },
  encabezado: {
    gap: espacio.s,
    marginBottom: espacio.s,
  },
  aviso: {
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: radio.m,
    padding: espacio.m,
    gap: espacio.xs,
  },
  sinLeer: {
    borderColor: colores.primario,
  },
});
