import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { SelectorCategoria } from '@/components/SelectorCategoria';
import { Texto } from '@/components/Texto';
import type { Categoria } from '@/lib/reportes/tipos';

export default function NuevoReporte() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);

  function guardar() {
    // Versión 1: todavía no hay dónde guardar el reporte ni validación.
    Alert.alert('Reporte creado', `"${titulo}" quedó registrado.`);
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
      />
      <Campo
        etiqueta="Descripción"
        placeholder="¿Qué pasa y desde cuándo?"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        maxLength={500}
      />
      <Campo
        etiqueta="Aula"
        placeholder="Ej.: B12"
        value={aula}
        onChangeText={setAula}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <SelectorCategoria valor={categoria} onCambiar={setCategoria} />
      <Boton titulo="Guardar reporte" onPress={guardar} />
    </Pantalla>
  );
}
