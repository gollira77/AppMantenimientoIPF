import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Text } from 'react-native';

import EscanearAula from '@/app/reporte/escanear';
import { useBorrador } from '@/hooks/useBorrador';
import { usePermiso } from '@/hooks/usePermiso';
import { leerCodigoAula } from '@/lib/aulas/codigoQr';
import { permisoSimulado } from '@/test-utils/permisoSimulado';
import { Proveedores } from '@/test-utils/Proveedores';
import { volverAlFoco } from '@/test-utils/routerSimulado';

jest.mock('@/hooks/usePermiso');

jest.mock('expo-camera', () => ({
  // La cámara simulada tiene dos botones que disparan lecturas, como si enfocara un QR.
  CameraView: ({ onBarcodeScanned }: { onBarcodeScanned?: (r: { data: string }) => void }) => {
    const { Pressable, Text: TextoMock, View } = jest.requireActual('react-native');
    return (
      <View>
        <TextoMock>vista de cámara</TextoMock>
        <Pressable onPress={() => onBarcodeScanned?.({ data: 'IPF-AULA:B12' })}>
          <TextoMock>leer QR de aula</TextoMock>
        </Pressable>
        <Pressable onPress={() => onBarcodeScanned?.({ data: 'https://example.com' })}>
          <TextoMock>leer QR ajeno</TextoMock>
        </Pressable>
      </View>
    );
  },
}));

jest.mock(
  'expo-router',
  () => jest.requireActual('@/test-utils/routerSimulado').expoRouterSimulado,
);

jest.mock('@/lib/aulas/codigoQr', () => {
  const real = jest.requireActual('@/lib/aulas/codigoQr');
  return { ...real, leerCodigoAula: jest.fn(real.leerCodigoAula) };
});

/** Muestra el aula del borrador para poder verificarla. */
function AulaDelBorrador() {
  const { borrador } = useBorrador();
  return <Text>borrador: {borrador.aula || '(vacío)'}</Text>;
}

function renderEscaner() {
  return render(
    <Proveedores>
      <EscanearAula />
      <AulaDelBorrador />
    </Proveedores>,
  );
}

function conPermiso(...args: Parameters<typeof permisoSimulado>) {
  const simulado = permisoSimulado(...args);
  jest.mocked(usePermiso).mockReturnValue(simulado);
  return simulado;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Escáner: los cuatro estados del permiso', () => {
  it('pide el permiso de la cámara', () => {
    conPermiso('cargando');
    renderEscaner();

    expect(usePermiso).toHaveBeenCalledWith('camara');
  });

  it('1. cargando: muestra el mensaje de carga y ningún botón', () => {
    conPermiso('cargando');
    renderEscaner();

    expect(screen.getByText('Consultando el permiso de la cámara…')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('2. concedido: muestra la cámara', () => {
    conPermiso('concedido');
    renderEscaner();

    expect(screen.getByText('vista de cámara')).toBeTruthy();
  });

  it('3. preguntable: abre la pantalla previa y no pide nada por su cuenta', () => {
    const permiso = conPermiso('preguntable');
    renderEscaner();

    expect(router.push).toHaveBeenCalledWith('/permisos/camara');
    expect(permiso.pedir).not.toHaveBeenCalled();
  });

  it('4. bloqueado: no vuelve a pedir y ofrece Abrir Ajustes', () => {
    const permiso = conPermiso('bloqueado');
    renderEscaner();

    expect(router.push).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('button', { name: 'Abrir Ajustes' }));

    expect(permiso.abrirAjustes).toHaveBeenCalled();
    expect(permiso.pedir).not.toHaveBeenCalled();
  });
});

describe('Escáner: no insistir después de un no (M52)', () => {
  it('al volver del modal con un no, la pantalla previa no aparece sola', () => {
    conPermiso('preguntable');
    renderEscaner();
    expect(router.push).toHaveBeenCalledTimes(1);

    volverAlFoco();

    expect(router.push).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Código del aula')).toBeTruthy();
  });

  it('vuelve a aparecer si la persona toca otra vez la función', () => {
    conPermiso('preguntable');
    renderEscaner();

    fireEvent.press(screen.getByRole('button', { name: 'Usar la cámara' }));

    expect(router.push).toHaveBeenCalledTimes(2);
  });

  it('en una visita nueva vuelve a aparecer: la persona tocó la función de nuevo', () => {
    conPermiso('preguntable');
    renderEscaner().unmount();
    renderEscaner();

    expect(router.push).toHaveBeenCalledTimes(2);
  });
});

describe('Escáner: lectura del QR', () => {
  beforeEach(() => {
    conPermiso('concedido');
  });

  it('guarda el aula leída en el borrador y vuelve al formulario', () => {
    renderEscaner();

    fireEvent.press(screen.getByText('leer QR de aula'));

    expect(screen.getByText('borrador: B12')).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('procesa una sola lectura aunque la cámara dispare varias seguidas', () => {
    renderEscaner();
    const boton = screen.getByText('leer QR de aula');

    fireEvent.press(boton);
    fireEvent.press(boton);
    fireEvent.press(boton);

    expect(leerCodigoAula).toHaveBeenCalledTimes(1);
  });

  it('avisa si el QR no es de un aula y permite escanear otra vez', () => {
    renderEscaner();

    fireEvent.press(screen.getByText('leer QR ajeno'));
    expect(screen.getByText('Ese QR no es de un aula')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Escanear otra vez' }));
    fireEvent.press(screen.getByText('leer QR de aula'));

    expect(screen.getByText('borrador: B12')).toBeTruthy();
    expect(leerCodigoAula).toHaveBeenCalledTimes(2);
  });
});

describe('Escáner: carga manual del aula (M28)', () => {
  it('debajo de la pantalla previa se puede escribir el aula', () => {
    conPermiso('preguntable');
    renderEscaner();

    expect(screen.getByLabelText('Código del aula')).toBeTruthy();
  });

  it('si la cámara está bloqueada, se puede escribir el aula', () => {
    conPermiso('bloqueado');
    renderEscaner();

    fireEvent.changeText(screen.getByLabelText('Código del aula'), 'lab-2');
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta aula' }));

    expect(screen.getByText('borrador: LAB-2')).toBeTruthy();
    expect(router.back).toHaveBeenCalled();
  });

  it('valida el aula escrita con la misma regla del formulario', () => {
    conPermiso('bloqueado');
    renderEscaner();

    fireEvent.changeText(screen.getByLabelText('Código del aula'), 'B 12');
    fireEvent.press(screen.getByRole('button', { name: 'Usar esta aula' }));

    expect(screen.getByText('Usá letras, números y guiones, por ejemplo B12.')).toBeTruthy();
    expect(screen.getByText('borrador: (vacío)')).toBeTruthy();
  });
});
