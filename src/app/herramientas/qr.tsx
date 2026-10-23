import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { AULAS_FRECUENTES } from '@/lib/aulas/aulas';
import { codigoQrDeAula } from '@/lib/aulas/codigoQr';
import { esquemaReporte } from '@/lib/reportes/esquema';
import { colores, espacio, radio, tipografia } from '@/lib/tema';

export default function GeneradorQr() {
  const [texto, setTexto] = useState('B12');
  const validacion = esquemaReporte.shape.aula.safeParse(texto);
  const aula = validacion.success ? validacion.data : null;

  return (
    <Pantalla>
      <Texto variante="secundario">
        Herramienta para probar el escáner: mostrá este QR en otra pantalla o imprimilo y escanealo
        desde «Nuevo reporte».
      </Texto>

      <View style={estilos.chips}>
        {AULAS_FRECUENTES.map((opcion) => (
          <Pressable
            key={opcion}
            accessibilityRole="button"
            accessibilityLabel={`Generar QR del aula ${opcion}`}
            onPress={() => setTexto(opcion)}
            style={[estilos.chip, opcion === aula && estilos.chipElegido]}>
            <Text style={[estilos.textoChip, opcion === aula && estilos.textoChipElegido]}>
              {opcion}
            </Text>
          </Pressable>
        ))}
      </View>

      <Campo
        etiqueta="Aula"
        value={texto}
        onChangeText={setTexto}
        autoCapitalize="characters"
        autoCorrect={false}
        error={validacion.success ? undefined : validacion.error.issues[0]?.message}
      />

      {aula ? (
        <Tarjeta>
          <View
            style={estilos.qr}
            accessible
            accessibilityLabel={`Código QR del aula ${aula}`}
            accessibilityRole="image">
            <QRCode value={codigoQrDeAula(aula)} size={220} />
          </View>
          <Texto variante="titulo" style={estilos.centrado}>
            Aula {aula}
          </Texto>
          <Texto variante="secundario" style={estilos.centrado}>
            {codigoQrDeAula(aula)}
          </Texto>
        </Tarjeta>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacio.s,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacio.m,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  chipElegido: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textoChip: {
    ...tipografia.cuerpo,
    color: colores.texto,
  },
  textoChipElegido: {
    color: colores.primarioTexto,
    fontWeight: '600',
  },
  qr: {
    alignItems: 'center',
    padding: espacio.m,
    backgroundColor: '#FFFFFF',
  },
  centrado: {
    textAlign: 'center',
  },
});
