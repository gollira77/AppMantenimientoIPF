import { useState } from 'react';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';
import { Tarjeta } from '@/components/Tarjeta';
import { esquemaReporte } from '@/lib/reportes/esquema';

type Props = {
  onConfirmar: (aula: string) => void;
};

/** Alternativa al escáner: escribir el código del aula. Usa la misma regla que el formulario. */
export function IngresoAulaManual({ onConfirmar }: Props) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string>();

  function confirmar() {
    const resultado = esquemaReporte.shape.aula.safeParse(texto);
    if (!resultado.success) {
      setError(resultado.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    onConfirmar(resultado.data);
  }

  return (
    <Tarjeta>
      <Campo
        etiqueta="Código del aula"
        placeholder="Ej.: B12"
        value={texto}
        onChangeText={setTexto}
        autoCapitalize="characters"
        autoCorrect={false}
        error={error}
        onSubmitEditing={confirmar}
        returnKeyType="done"
      />
      <Boton titulo="Usar esta aula" onPress={confirmar} />
    </Tarjeta>
  );
}
