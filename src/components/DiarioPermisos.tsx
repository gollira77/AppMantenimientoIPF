import { View } from 'react-native';

import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { useDiario } from '@/hooks/useDiario';
import { ETIQUETA_PERMISO } from '@/lib/permisos/matiz';

const formatoHora = new Intl.DateTimeFormat('es-AR', { timeStyle: 'medium' });

export function DiarioPermisos() {
  const entradas = useDiario();

  return (
    <Tarjeta>
      <Texto variante="subtitulo">Diario de permisos</Texto>
      {entradas.length === 0 ? (
        <Texto variante="secundario">Todavía no se consultó ningún permiso.</Texto>
      ) : (
        <View>
          {entradas.map((entrada) => (
            <Texto key={entrada.id} variante="secundario">
              {formatoHora.format(new Date(entrada.hora))} · {entrada.accion} · {entrada.recurso} →{' '}
              {ETIQUETA_PERMISO[entrada.resultado]}
            </Texto>
          ))}
        </View>
      )}
    </Tarjeta>
  );
}
