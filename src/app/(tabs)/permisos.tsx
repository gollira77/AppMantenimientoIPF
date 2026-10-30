import { router } from 'expo-router';
import { Platform } from 'react-native';

import { Boton } from '@/components/Boton';
import { DiarioPermisos } from '@/components/DiarioPermisos';
import { Pantalla } from '@/components/Pantalla';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';
import { usePanelPermisos } from '@/hooks/usePanelPermisos';
import { interpretarRespuesta } from '@/lib/permisos/interpretar';
import { ETIQUETA_PERMISO, textoMatiz } from '@/lib/permisos/matiz';
import { RECURSOS, TEXTOS_PREVIA } from '@/lib/permisos/previa';

export default function Permisos() {
  const respuestas = usePanelPermisos();

  return (
    <Pantalla>
      <Texto variante="titulo">Permisos de la app</Texto>
      <Texto variante="secundario">Plataforma: {Platform.OS}</Texto>

      {RECURSOS.map((recurso) => {
        const respuesta = respuestas[recurso];
        const estado = interpretarRespuesta(respuesta);
        const matiz = textoMatiz(respuesta);
        return (
          <Tarjeta key={recurso}>
            <Texto variante="subtitulo">{TEXTOS_PREVIA[recurso].titulo}</Texto>
            <Texto>{ETIQUETA_PERMISO[estado]}</Texto>
            {matiz ? <Texto variante="secundario">{matiz}</Texto> : null}
            {estado === 'preguntable' || estado === 'bloqueado' ? (
              <Boton
                titulo={estado === 'bloqueado' ? 'Cómo habilitarlo' : 'Activar'}
                variante="secundario"
                pista={TEXTOS_PREVIA[recurso].titulo}
                onPress={() => router.push(`/permisos/${recurso}`)}
              />
            ) : null}
          </Tarjeta>
        );
      })}

      <Tarjeta>
        <Texto variante="subtitulo">Galería de fotos</Texto>
        <Texto>no requerida (selector del sistema)</Texto>
      </Tarjeta>

      <DiarioPermisos />
    </Pantalla>
  );
}
