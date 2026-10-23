import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';
import { leerCodigoAula, type LecturaQr } from '@/lib/aulas/codigoQr';
import { colores, espacio } from '@/lib/tema';

export default function EscanearAula() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [lectura, setLectura] = useState<LecturaQr | null>(null);
  // La cámara dispara el evento muchas veces por segundo mientras el QR está enfocado.
  // El ref corta en la primera lectura, antes de que React vuelva a dibujar.
  const yaLeido = useRef(false);

  function alLeer({ data }: BarcodeScanningResult) {
    if (yaLeido.current) return;
    yaLeido.current = true;
    setLectura(leerCodigoAula(data));
  }

  function escanearOtraVez() {
    yaLeido.current = false;
    setLectura(null);
  }

  // 1. Cargando: el hook todavía está consultando al sistema.
  if (!permiso) {
    return <Cargando mensaje="Consultando el permiso de la cámara…" />;
  }

  // 2. Concedido: muestro la cámara (o el resultado de la lectura).
  if (permiso.granted) {
    if (lectura) {
      return (
        <Pantalla centrada>
          {lectura.tipo === 'aula' ? (
            <>
              <Texto variante="titulo">Aula {lectura.aula}</Texto>
              <Texto>Leímos el código del aula correctamente.</Texto>
            </>
          ) : (
            <>
              <Texto variante="titulo">Ese QR no es de un aula</Texto>
              <Texto>Buscá el código pegado en la puerta del aula, que empieza con IPF-AULA.</Texto>
            </>
          )}
          <Boton titulo="Escanear otra vez" variante="secundario" onPress={escanearOtraVez} />
        </Pantalla>
      );
    }

    return (
      <View style={estilos.contenedor}>
        <CameraView
          style={estilos.camara}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={lectura ? undefined : alLeer}
        />
        <View style={estilos.pie}>
          <Texto style={estilos.textoPie}>Apuntá al código QR pegado en la puerta del aula.</Texto>
        </View>
      </View>
    );
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
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
  },
  camara: {
    flex: 1,
  },
  pie: {
    padding: espacio.m,
    backgroundColor: colores.texto,
  },
  textoPie: {
    color: colores.primarioTexto,
    textAlign: 'center',
  },
});
