import { fireEvent, render, screen } from '@testing-library/react-native';

import { Boton } from '@/components/Boton';
import { Campo } from '@/components/Campo';

describe('Boton', () => {
  it('llama a onPress al tocarlo', () => {
    const onPress = jest.fn();
    render(<Boton titulo="Continuar" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no responde si está deshabilitado', () => {
    const onPress = jest.fn();
    render(<Boton titulo="Guardar" onPress={onPress} deshabilitado />);

    fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('no responde mientras está cargando', () => {
    const onPress = jest.fn();
    render(<Boton titulo="Guardar" onPress={onPress} cargando />);

    fireEvent.press(screen.getByRole('button', { name: 'Guardar' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Campo', () => {
  it('muestra la etiqueta y el error', () => {
    render(<Campo etiqueta="Título" error="Escribí un título" />);

    expect(screen.getByLabelText('Título')).toBeTruthy();
    expect(screen.getByText('Escribí un título')).toBeTruthy();
  });

  it('avisa cada cambio de texto', () => {
    const onChangeText = jest.fn();
    render(<Campo etiqueta="Aula" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText('Aula'), 'B12');

    expect(onChangeText).toHaveBeenCalledWith('B12');
  });
});
