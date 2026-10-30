const LADO_MAXIMO = 900;

/**
 * En web, la foto es un texto base64 que se guarda completo en localStorage, y su espacio
 * es de unos pocos MB. Una foto grande llenaría el almacenamiento y dejaría de guardarse todo.
 */
export function reducirFoto(uri: string): Promise<string> {
  return new Promise((resolve) => {
    const imagen = new Image();
    imagen.onerror = () => resolve(uri);
    imagen.onload = () => {
      const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(imagen.width * escala);
      lienzo.height = Math.round(imagen.height * escala);
      lienzo.getContext('2d')?.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      resolve(lienzo.toDataURL('image/jpeg', 0.7));
    };
    imagen.src = uri;
  });
}
