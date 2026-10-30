import type { Reporte } from '@/lib/reportes/tipos';

// Reportes de ejemplo para ver la lista antes de tener formulario y persistencia.
export const REPORTES_DE_PRUEBA: Reporte[] = [
  {
    id: '1',
    titulo: 'Enchufe quemado',
    descripcion: 'El enchufe de la pared del fondo tiene olor a quemado y no anda.',
    aula: 'B12',
    categoria: 'electricidad',
    estado: 'pendiente',
    creadoEn: '2026-10-20T10:15:00.000Z',
  },
  {
    id: '2',
    titulo: 'Canilla que gotea',
    descripcion: 'La canilla del baño de planta baja gotea todo el día.',
    aula: 'PB-BAÑO',
    categoria: 'agua',
    estado: 'en_proceso',
    creadoEn: '2026-10-18T14:40:00.000Z',
  },
  {
    id: '3',
    titulo: 'Proyector sin imagen',
    descripcion: 'El proyector prende pero no muestra la imagen de la computadora.',
    aula: 'LAB-2',
    categoria: 'equipos',
    estado: 'resuelto',
    creadoEn: '2026-10-15T09:00:00.000Z',
  },
];
