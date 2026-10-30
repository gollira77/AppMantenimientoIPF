import { Stack } from 'expo-router';

import { Enlace } from '@/components/Enlace';
import { Pantalla } from '@/components/Pantalla';
import { Texto } from '@/components/Texto';

export default function NoEncontrada() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrada' }} />
      <Pantalla centrada>
        <Texto variante="titulo">Esta pantalla no existe</Texto>
        <Texto>Puede que el enlace esté mal escrito o que la pantalla se haya movido.</Texto>
        <Enlace href="/">Volver a mis reportes</Enlace>
      </Pantalla>
    </>
  );
}
