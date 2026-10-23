import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Pantalla } from '@/components/Pantalla';
import { SelectorCategoria } from '@/components/SelectorCategoria';
import { Texto } from '@/components/Texto';
import { useReportes } from '@/hooks/useReportes';
import { validarReporte, type ErroresReporte } from '@/lib/reportes/esquema';
import type { Categoria } from '@/lib/reportes/tipos';

export default function NuevoReporte() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [errores, setErrores] = useState<ErroresReporte>({});
  const { agregar } = useReportes();

  function guardar() {
    const resultado = validarReporte({ titulo, descripcion, aula, categoria });
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }

    setErrores({});
    const nuevo = agregar(resultado.datos);
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
