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
import type { Borrador } from '@/lib/reportes/borrador';
import { validarReporte, type ErroresReporte } from '@/lib/reportes/esquema';

function textoBotonUbicacion({ ubicacion, sector }: Borrador) {
  if (sector) return `Sector: ${sector}`;
  if (ubicacion) return 'Ubicación agregada ✓';
  return 'Agregar ubicación o sector (opcional)';
}

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
      <Boton
        titulo={textoBotonUbicacion(borrador)}
        variante="secundario"
        pista="Usa la ubicación del celular para indicar dónde está el desperfecto"
        onPress={() => router.push('/reporte/ubicacion')}
      />
      <Boton
        titulo={borrador.fotoUri ? 'Foto agregada ✓' : 'Agregar foto (opcional)'}
        variante="secundario"
        onPress={() => router.push('/reporte/foto')}
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
