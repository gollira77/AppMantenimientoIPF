import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/Boton';
import { Cargando } from '@/components/Cargando';
import { IngresoAulaManual } from '@/components/IngresoAulaManual';
import { Pantalla } from '@/components/Pantalla';
import { ProblemaCamara } from '@/components/ProblemaCamara';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { usePantallaPrevia } from '@/hooks/usePantallaPrevia';
import { usePermiso } from '@/hooks/usePermiso';
import { leerCodigoAula } from '@/lib/aulas/codigoQr';
import { volver } from '@/lib/navegacion';
import { colores, espacio } from '@/lib/tema';

export default function EscanearAula() {
  const { estado, abrirAjustes } = usePermiso('camara');
  const abrirPrevia = usePantallaPrevia('camara', estado);
  const { actualizar } = useBorrador();
  // Solo guardo en pantalla las lecturas que no sirven; un aula válida va directo al borrador.
  const [qrAjeno, setQrAjeno] = useState(false);
  // El permiso está dado, pero la cámara puede fallar igual: ocupada, desconectada o bloqueada.
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  // La cámara dispara el evento muchas veces por segundo mientras el QR está enfocado.
  // El ref corta en la primera lectura, antes de que React vuelva a dibujar.
  const yaLeido = useRef(false);

  function usarAula(aula: string) {
    actualizar({ aula });
    // Vuelvo al formulario; si se abrió el escáner directo por URL, lo abro.
    volver('/reporte/nuevo');
  }

  function alLeer({ data }: BarcodeScanningResult) {
    if (yaLeido.current) return;
    yaLeido.current = true;
    const lectura = leerCodigoAula(data);
    if (lectura.tipo === 'aula') {
      usarAula(lectura.aula);
    } else {
      setQrAjeno(true);
    }
  }

  function escanearOtraVez() {
    yaLeido.current = false;
    setQrAjeno(false);
  }

  if (qrAjeno) {
    return (
      <Pantalla centrada>
        <Texto variante="titulo">Ese QR no es de un aula</Texto>
        <Texto>Buscá el código pegado en la puerta del aula, que empieza con IPF-AULA.</Texto>
        <Boton titulo="Escanear otra vez" variante="secundario" onPress={escanearOtraVez} />
      </Pantalla>
    );
  }

  const cargaManual = <IngresoAulaManual onConfirmar={usarAula} />;

  // 1. Cargando: el hook todavía está consultando al sistema.
  if (estado === 'cargando') {
    return <Cargando mensaje="Consultando el permiso de la cámara…" />;
  }

  // 2. Concedido, pero la cámara no arrancó: lo digo y dejo escribir el aula.
  if (estado === 'concedido' && errorCamara) {
    return (
      <Pantalla>
        <ProblemaCamara
          detalle={errorCamara}
          onReintentar={() => {
            setErrorCamara(null);
            setIntento(intento + 1);
          }}
        />
        {cargaManual}
      </Pantalla>
    );
  }

  // 2. Concedido: muestro la cámara.
  if (estado === 'concedido') {
    return (
      <View style={estilos.contenedor}>
        <CameraView
          key={intento}
          onMountError={({ message }) => setErrorCamara(message)}
          style={estilos.camara}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={qrAjeno ? undefined : alLeer}
        />
        <View style={estilos.pie}>
          <Texto style={estilos.textoPie}>Apuntá al código QR pegado en la puerta del aula.</Texto>
        </View>
      </View>
    );
  }

  // 3. Preguntable: la explicación con "Continuar" está en la pantalla previa, que se abre encima.
  // Debajo queda la carga manual para quien diga que no.
  if (estado === 'preguntable') {
    return (
      <Pantalla>
        <Texto variante="titulo">Escribí el código del aula</Texto>
        <Texto>
          Sin cámara también podés hacer el reporte: el código está en la puerta del aula.
        </Texto>
        <Boton titulo="Usar la cámara" variante="secundario" onPress={abrirPrevia} />
        {cargaManual}
      </Pantalla>
    );
  }

  // 4. Bloqueado: explico cómo habilitarla y dejo escribir el aula.
  return (
    <Pantalla>
      <Texto variante="titulo">La cámara está desactivada</Texto>
      <Texto>
        Para escanear el QR, habilitá la cámara para esta app en Ajustes y volvé a esta pantalla.
        Mientras tanto, podés escribir el código del aula.
      </Texto>
      <Boton titulo="Abrir Ajustes" variante="secundario" onPress={abrirAjustes} />
      {cargaManual}
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
