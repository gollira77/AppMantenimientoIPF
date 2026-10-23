import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { radio } from '@/lib/tema';

function volver() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/reporte/nuevo');
  }
}

export default function FotoReporte() {
  const { borrador, actualizar } = useBorrador();
  const [uri, setUri] = useState<string | null>(borrador.fotoUri);

  async function elegirDeGaleria() {
    // El selector del sistema corre fuera de la app: la persona elige una foto y
    // el sistema nos da solo esa. No hace falta (ni se pide) permiso de galería.
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      setUri(resultado.assets[0].uri);
    }
  }

  function usarFoto() {
    actualizar({ fotoUri: uri });
    volver();
  }

  function quitarFoto() {
    setUri(null);
    actualizar({ fotoUri: null });
  }

  return (
    <Pantalla>
      <Texto variante="titulo">Foto del desperfecto</Texto>
      <Texto variante="secundario">
        Una foto ayuda a entender el problema. Es opcional: el reporte se puede enviar sin foto.
      </Texto>

      {uri ? (
        <Image
          source={{ uri }}
          style={estilos.foto}
          accessibilityLabel="Foto elegida del desperfecto"
          resizeMode="cover"
        />
      ) : null}

      <Boton
        titulo="Elegir de la galería"
        variante={uri ? 'secundario' : 'primario'}
        pista="Abre el selector de fotos del sistema"
        onPress={elegirDeGaleria}
      />
      {uri ? (
        <>
          <Boton titulo="Usar esta foto" onPress={usarFoto} />
          <Boton titulo="Quitar la foto" variante="peligro" onPress={quitarFoto} />
        </>
      ) : null}
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
