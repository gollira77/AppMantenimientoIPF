import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { SelectorCategoria } from '@/components/SelectorCategoria';
import { Texto } from '@/components/Texto';
import { validarReporte, type ErroresReporte } from '@/lib/reportes/esquema';
import type { Categoria } from '@/lib/reportes/tipos';

export default function NuevoReporte() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [errores, setErrores] = useState<ErroresReporte>({});

  function guardar() {
    const resultado = validarReporte({ titulo, descripcion, aula, categoria });
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }

    setErrores({});
    // Todavía no hay dónde guardar el reporte: la lista no lo va a ver (se resuelve en M21).
    Alert.alert('Reporte creado', `"${resultado.datos.titulo}" quedó registrado.`);
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
        value={titulo}
        onChangeText={setTitulo}
        maxLength={60}
        error={errores.titulo}
      />
      <Campo
        etiqueta="Descripción"
        placeholder="¿Qué pasa y desde cuándo?"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        maxLength={500}
        error={errores.descripcion}
      />
      <Campo
        etiqueta="Aula"
        placeholder="Ej.: B12"
        value={aula}
        onChangeText={setAula}
        autoCapitalize="characters"
        autoCorrect={false}
        error={errores.aula}
      />
      <SelectorCategoria valor={categoria} onCambiar={setCategoria} error={errores.categoria} />
      <Boton titulo="Guardar reporte" onPress={guardar} />
    </Pantalla>
  );
}
