import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function EscanearAula() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  // Versión ingenua: solo miro si está concedido.
  if (permiso?.granted) {
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
