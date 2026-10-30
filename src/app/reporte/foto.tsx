import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import { Boton } from '@/components/Boton';
import { CamaraEnVivo } from '@/components/CamaraEnVivo';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { reducirFoto } from '@/lib/fotos/reducir';
import { volver } from '@/lib/navegacion';
import { radio } from '@/lib/tema';

const volverAlFormulario = () => volver('/reporte/nuevo');

export default function FotoReporte() {
  const { borrador, actualizar } = useBorrador();
  const [uri, setUri] = useState<string | null>(borrador.fotoUri);
  // Es el mismo permiso de cámara que usa el escáner: si ya se dio ahí, acá no se vuelve a pedir.
  const camara = usePermiso('camara');
  const [sinCamara, setSinCamara] = useState(false);
  const [camaraAbierta, setCamaraAbierta] = useState(false);
  // La persona tocó "Sacar foto" y fue a la pantalla previa: al volver, retomo desde acá.
  const queriaSacarFoto = useRef(false);

  const guardarFoto = useCallback(
    async (original: string) => {
      const nueva = await reducirFoto(original);
      setUri(nueva);
      actualizar({ fotoUri: nueva });
    },
    [actualizar],
  );

  const guardarResultado = useCallback(
    async (resultado: ImagePicker.ImagePickerResult) => {
      if (!resultado.canceled && resultado.assets[0]) {
        await guardarFoto(resultado.assets[0].uri);
      }
    },
    [guardarFoto],
  );

  async function elegirDeGaleria() {
    // El selector del sistema corre fuera de la app: la persona elige una foto y
    // el sistema nos da solo esa. No hace falta (ni se pide) permiso de galería.
    await guardarResultado(
      await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 }),
    );
  }

  const abrirCamara = useCallback(async () => {
    // En una compu, launchCameraAsync abre el selector de archivos: la cámara va dentro de la app.
    if (Platform.OS === 'web') {
      setCamaraAbierta(true);
      return;
    }
    await guardarResultado(
      await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 }),
    );
  }, [guardarResultado]);

  useFocusEffect(
    useCallback(() => {
      if (!queriaSacarFoto.current) return;
      queriaSacarFoto.current = false;
      if (camara.estado === 'concedido') {
        void abrirCamara();
      } else {
        setSinCamara(true);
      }
    }, [camara.estado, abrirCamara]),
  );

  function sacarFoto() {
    setSinCamara(false);
    if (camara.estado === 'concedido') {
      void abrirCamara();
    } else if (camara.estado !== 'cargando') {
      // Preguntable o bloqueado: primero explico, nunca muestro el diálogo de golpe.
      queriaSacarFoto.current = true;
      router.push('/permisos/camara');
    }
  }

  function usarFoto() {
    actualizar({ fotoUri: uri });
    volverAlFormulario();
  }

  function quitarFoto() {
    setUri(null);
    actualizar({ fotoUri: null });
  }

  if (camaraAbierta) {
    return (
      <CamaraEnVivo
        onFoto={(foto) => {
          setCamaraAbierta(false);
          void guardarFoto(foto);
        }}
        onCancelar={() => setCamaraAbierta(false)}
      />
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
