import { router } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { usePermiso } from '@/hooks/usePermiso';
import { usePreferencias } from '@/hooks/usePreferencias';
import { colores, espacio } from '@/lib/tema';

const ETIQUETA = 'Avisarme cuando se resuelva mi reporte';

export default function AjustesApp() {
  const { estado } = usePermiso('notificaciones');
  const { quiereAvisos, setQuiereAvisos } = usePreferencias();
  const concedido = estado === 'concedido';
  // Encendido solo si la persona lo quiere y además el sistema lo permite.
  const activo = quiereAvisos && concedido;

  function cambiar(valor: boolean) {
    setQuiereAvisos(valor);
    // Este es el único lugar de la app desde el que se llega a pedir notificaciones.
    if (valor && !concedido) router.push('/permisos/notificaciones');
  }

  return (
    <Pantalla>
      <Tarjeta>
        <View style={estilos.fila}>
          <Texto style={estilos.etiqueta}>{ETIQUETA}</Texto>
          <Switch
            accessibilityLabel={ETIQUETA}
            value={activo}
            onValueChange={cambiar}
            disabled={estado === 'cargando'}
            trackColor={{ true: colores.primario }}
          />
        </View>
      </Tarjeta>
      {quiereAvisos && !concedido && estado !== 'cargando' ? (
        <Texto variante="secundario">
          Sin el permiso de notificaciones, los avisos te esperan en la pestaña Avisos.
        </Texto>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
  },
  etiqueta: {
    flex: 1,
  },
});
