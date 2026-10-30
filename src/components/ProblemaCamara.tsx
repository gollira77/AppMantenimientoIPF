import { Boton } from '@/components/Boton';
import { Tarjeta } from '@/components/Tarjeta';
import { Texto } from '@/components/Texto';

type Props = {
  /** El motivo que dio el sistema. */
  detalle: string;
  onReintentar: () => void;
};

/** El permiso está concedido pero la cámara no arrancó: sin esto solo se vería negro. */
export function ProblemaCamara({ detalle, onReintentar }: Props) {
  return (
    <Tarjeta>
      <Texto variante="subtitulo">No pudimos abrir la cámara</Texto>
      <Texto>Revisá que esté conectada y que no la esté usando otra app, como Meet o Zoom.</Texto>
      <Texto variante="secundario">Detalle: {detalle}</Texto>
      <Boton titulo="Reintentar" variante="secundario" onPress={onReintentar} />
    </Tarjeta>
  );
}
