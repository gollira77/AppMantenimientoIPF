import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
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
  // Es el mismo permiso de cámara que usa el escáner: si ya se dio ahí, acá no se vuelve a pedir.
  const camara = usePermiso('camara');
  const [explicandoCamara, setExplicandoCamara] = useState(false);
  const [sinCamara, setSinCamara] = useState(false);

  function guardarResultado(resultado: ImagePicker.ImagePickerResult) {
    if (!resultado.canceled && resultado.assets[0]) {
      setUri(resultado.assets[0].uri);
    }
  }

  async function elegirDeGaleria() {
    // El selector del sistema corre fuera de la app: la persona elige una foto y
    // el sistema nos da solo esa. No hace falta (ni se pide) permiso de galería.
    guardarResultado(
      await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 }),
    );
  }

  async function abrirCamara() {
    guardarResultado(await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 }));
  }

  function sacarFoto() {
    setSinCamara(false);
    if (camara.estado === 'concedido') {
      void abrirCamara();
    } else if (camara.estado !== 'cargando') {
      // Preguntable o bloqueado: primero explico, nunca muestro el diálogo de golpe.
      setExplicandoCamara(true);
    }
  }

  async function continuar() {
    const nuevo = await camara.pedir();
    setExplicandoCamara(false);
    if (nuevo === 'concedido') {
      await abrirCamara();
    } else {
      setSinCamara(true);
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

  if (explicandoCamara && camara.estado === 'preguntable') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">Sacar una foto</Texto>
        <Texto>Usamos tu cámara para sacar la foto del desperfecto que reportás.</Texto>
        <Texto variante="secundario">Podés cambiar este permiso cuando quieras en Ajustes.</Texto>
        <Boton titulo="Continuar" onPress={continuar} />
      </Pantalla>
    );
  }

  if (explicandoCamara && camara.estado === 'bloqueado') {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">La cámara está desactivada</Texto>
        <Texto>
          Para sacar la foto, habilitá la cámara para esta app en Ajustes. También podés elegir una
          foto de la galería, que no necesita ningún permiso.
        </Texto>
        <Boton titulo="Abrir Ajustes" onPress={camara.abrirAjustes} />
        <Boton
          titulo="Elegir de la galería"
          variante="secundario"
          onPress={() => {
            setExplicandoCamara(false);
            void elegirDeGaleria();
          }}
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Texto variante="titulo">Foto del desperfecto</Texto>
      <Texto variante="secundario">
        Una foto ayuda a entender el problema. Es opcional: el reporte se puede enviar sin foto.
      </Texto>

      {sinCamara ? (
        <Tarjeta>
          <Texto>Sin cámara también podés agregar una foto: elegila de la galería.</Texto>
        </Tarjeta>
      ) : null}

      {uri ? (
        <Image
          source={{ uri }}
          style={estilos.foto}
          accessibilityLabel="Foto elegida del desperfecto"
          resizeMode="cover"
        />
      ) : null}

      <Boton
        titulo="Sacar foto"
        variante={uri ? 'secundario' : 'primario'}
        cargando={camara.estado === 'cargando'}
        pista="Abre la cámara del celular"
        onPress={sacarFoto}
      />
      <Boton
        titulo="Elegir de la galería"
        variante="secundario"
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
