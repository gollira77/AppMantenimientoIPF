import { fireEvent, render, screen } from '@testing-library/react-native';

import GeneradorQr from '@/app/herramientas/qr';
import { leerCodigoAula } from '@/lib/aulas/codigoQr';

describe('Generador de QR', () => {
  it('arranca con el QR del aula B12', () => {
    render(<GeneradorQr />);

    expect(screen.getByText('qr:IPF-AULA:B12')).toBeTruthy();
    expect(screen.getByText('Aula B12')).toBeTruthy();
  });

  it('cambia el QR al elegir otra aula', () => {
    render(<GeneradorQr />);

    fireEvent.press(screen.getByRole('button', { name: 'Generar QR del aula LAB-2' }));

    expect(screen.getByText('qr:IPF-AULA:LAB-2')).toBeTruthy();
  });

  it('genera el QR de un aula escrita a mano, en mayúsculas', () => {
    render(<GeneradorQr />);

    fireEvent.changeText(screen.getByLabelText('Aula'), 'c7');

    expect(screen.getByText('qr:IPF-AULA:C7')).toBeTruthy();
  });

  it('no genera QR para un aula inválida', () => {
    render(<GeneradorQr />);

    fireEvent.changeText(screen.getByLabelText('Aula'), 'C 7');

    expect(screen.queryByText(/^qr:/)).toBeNull();
    expect(screen.getByText('Usá letras, números y guiones, por ejemplo B12.')).toBeTruthy();
  });

  it('el QR generado lo entiende el escáner', () => {
    render(<GeneradorQr />);
    const contenido = screen.getByText(/^qr:/).props.children as string;

    expect(leerCodigoAula(contenido.replace('qr:', ''))).toEqual({ tipo: 'aula', aula: 'B12' });
  });
});
