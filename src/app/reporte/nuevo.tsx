import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { SelectorCategoria } from '@/components/SelectorCategoria';
import { Texto } from '@/components/Texto';
import { useBorrador } from '@/hooks/useBorrador';
import { useReportes } from '@/hooks/useReportes';
import { validarReporte, type ErroresReporte } from '@/lib/reportes/esquema';

export default function NuevoReporte() {
  // Los datos viven en el borrador compartido: así el escáner puede completar el aula.
  const { borrador, actualizar, limpiar } = useBorrador();
  const [errores, setErrores] = useState<ErroresReporte>({});
  const { agregar } = useReportes();

  function guardar() {
    const resultado = validarReporte(borrador);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }

    setErrores({});
    const nuevo = agregar(resultado.datos);
    limpiar();
    Alert.alert('Reporte creado', `"${nuevo.titulo}" quedó registrado.`);
    router.back();
  }

  return (
    <Pantalla>
      <Texto variante="secundario">
        Contanos qué pasó y dónde. Ningún dato del celular es obligatorio para crear el reporte.
      </Texto>
      <Campo
        etiqueta="Título"
        placeholder="Ej.: Enchufe quemado"
        value={borrador.titulo}
        onChangeText={(titulo) => actualizar({ titulo })}
        maxLength={60}
        error={errores.titulo}
      />
      <Campo
        etiqueta="Descripción"
        placeholder="¿Qué pasa y desde cuándo?"
        value={borrador.descripcion}
        onChangeText={(descripcion) => actualizar({ descripcion })}
        multiline
        maxLength={500}
        error={errores.descripcion}
      />
      <Campo
        etiqueta="Aula"
        placeholder="Ej.: B12"
        value={borrador.aula}
        onChangeText={(aula) => actualizar({ aula })}
        autoCapitalize="characters"
        autoCorrect={false}
        error={errores.aula}
      />
      <Boton
        titulo="Escanear QR del aula"
        variante="secundario"
        pista="Abre la cámara para leer el código pegado en la puerta"
        onPress={() => router.push('/reporte/escanear')}
      />
      <SelectorCategoria
        valor={borrador.categoria}
        onCambiar={(categoria) => actualizar({ categoria })}
        error={errores.categoria}
      />
      <Boton titulo="Guardar reporte" onPress={guardar} />
    </Pantalla>
  );
}
