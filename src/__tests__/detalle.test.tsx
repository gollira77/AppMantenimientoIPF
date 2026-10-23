import { renderRouter, screen } from 'expo-router/testing-library';

import { buscarReporte } from '@/lib/reportes/buscar';
import { REPORTES_DE_PRUEBA } from '@/lib/reportes/datosDePrueba';

describe('buscarReporte', () => {
  it('encuentra un reporte existente', () => {
    const resultado = buscarReporte(REPORTES_DE_PRUEBA, '2');

    expect(resultado.tipo).toBe('encontrado');
    if (resultado.tipo === 'encontrado') {
      expect(resultado.reporte.titulo).toBe('Canilla que gotea');
    }
  });

  it('distingue un id válido que no existe', () => {
    expect(buscarReporte(REPORTES_DE_PRUEBA, '999')).toEqual({ tipo: 'no_encontrado', id: '999' });
  });

  it.each([undefined, '', ['1', '2'], 'hola mundo', '<script>', 'x'.repeat(41)])(
    'marca como inválido el id %p',
    (id) => {
      expect(buscarReporte(REPORTES_DE_PRUEBA, id)).toEqual({ tipo: 'invalido' });
    },
  );
});

describe('Pantalla de detalle', () => {
  it('muestra el reporte', () => {
    renderRouter('./src/app', { initialUrl: '/reporte/1' });

    expect(screen.getByText('Enchufe quemado')).toBeTruthy();
    expect(screen.getByText('B12')).toBeTruthy();
    expect(screen.getByText('Electricidad')).toBeTruthy();
  });

  it('avisa si el reporte no existe', () => {
    renderRouter('./src/app', { initialUrl: '/reporte/999' });

    expect(screen.getByText('No encontramos el reporte')).toBeTruthy();
    expect(screen.getByText('Volver a mis reportes')).toBeTruthy();
  });

  it('avisa si el id no es válido', () => {
    renderRouter('./src/app', { initialUrl: '/reporte/hola%20mundo' });

    expect(screen.getByText('El enlace no es válido')).toBeTruthy();
  });
});
