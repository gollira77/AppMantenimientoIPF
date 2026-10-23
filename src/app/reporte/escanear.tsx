import { CameraView, useCameraPermissions } from 'expo-camera';
import { Linking, StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function EscanearAula() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  // 1. Cargando: el hook todavía está consultando al sistema.
  if (!permiso) {
    return <Cargando mensaje="Consultando el permiso de la cámara…" />;
  }

  // 2. Concedido: muestro la cámara.
  if (permiso.granted) {
    return <CameraView style={estilos.camara} facing="back" />;
  }

  // 3. Preguntable: el sistema todavía puede mostrar el diálogo.
  if (permiso.canAskAgain) {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">Escanear el QR del aula</Texto>
        <Texto>Usamos tu cámara para leer el código QR del aula y completar el reporte solo.</Texto>
        <Texto variante="secundario">Podés cambiar este permiso cuando quieras en Ajustes.</Texto>
        <Boton titulo="Continuar" onPress={pedirPermiso} />
      </Pantalla>
    );
  }

  // 4. Bloqueado: el sistema ya no muestra el diálogo; solo se cambia desde Ajustes.
  return (
    <Pantalla centrada>
      <Texto variante="titulo">La cámara está desactivada</Texto>
      <Texto>
        Para escanear el QR, habilitá la cámara para esta app en Ajustes y volvé a esta pantalla.
      </Texto>
      <Boton titulo="Abrir Ajustes" onPress={() => Linking.openSettings()} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  camara: {
    flex: 1,
  },
});
