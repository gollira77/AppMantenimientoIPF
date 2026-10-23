import { textoUbicacion } from '@/lib/reportes/textoUbicacion';

describe('textoUbicacion', () => {
  it('muestra las coordenadas con 5 decimales si es precisa', () => {
    expect(textoUbicacion({ latitud: -26.184891, longitud: -58.173129, aproximada: false })).toBe(
      '-26.18489, -58.17313',
    );
  });

  it('nunca muestra coordenadas si es aproximada', () => {
    expect(textoUbicacion({ latitud: -26.184891, longitud: -58.173129, aproximada: true })).toBe(
      'Ubicación aproximada',
    );
  });
});
