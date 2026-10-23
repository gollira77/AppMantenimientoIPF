import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function EscanearAula() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  // Primer render: el hook todavía está consultando al sistema.
  if (!permiso) {
    return <Cargando mensaje="Consultando el permiso de la cámara…" />;
  }

  if (permiso.granted) {
    return <CameraView style={estilos.camara} facing="back" />;
  }

  return (
    <Pantalla centrada>
      <Texto variante="titulo">Escanear aula</Texto>
      <Texto>Usamos la cámara para leer el QR del aula.</Texto>
      <Boton titulo="Permitir" onPress={pedirPermiso} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  camara: {
    flex: 1,
  },
});
