import { CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { ProblemaCamara } from '@/components/ProblemaCamara';
import { colores, espacio } from '@/lib/tema';

type Props = {
  onFoto: (uri: string) => void;
  onCancelar: () => void;
};

/** Cámara dentro de la app. En web, `launchCameraAsync` solo abre el selector de archivos. */
export function CamaraEnVivo({ onFoto, onCancelar }: Props) {
  const camara = useRef<CameraView>(null);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  async function tomarFoto() {
    try {
      const foto = await camara.current?.takePictureAsync({ imageType: 'jpg', quality: 0.7 });
      if (foto) onFoto(foto.uri);
    } catch {
      // Se tocó antes de que el video estuviera listo: la persona puede volver a tocar.
    }
  }

  if (error) {
    return (
      <Pantalla>
        <ProblemaCamara
          detalle={error}
          onReintentar={() => {
            setError(null);
            setIntento(intento + 1);
          }}
        />
        <Boton titulo="Cancelar" variante="secundario" onPress={onCancelar} />
      </Pantalla>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <CameraView
        key={intento}
        ref={camara}
        style={estilos.camara}
        onMountError={({ message }) => setError(message)}
      />
      <View style={estilos.pie}>
        <Boton titulo="Tomar foto" onPress={tomarFoto} />
        <Boton titulo="Cancelar" variante="secundario" onPress={onCancelar} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.primario,
  },
  camara: {
    flex: 1,
  },
  pie: {
    padding: espacio.m,
    gap: espacio.s,
  },
});
