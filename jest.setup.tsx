// Los íconos cargan una fuente de forma asíncrona y eso genera avisos de act() en los tests.
// Los reemplazo por un componente vacío: en los tests no importa cómo se ve el ícono.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const Icono = () => null;
  Icono.glyphMap = {};
  return { __esModule: true, default: Icono };
});

// En Node no hay cámara. Por defecto el permiso queda "cargando" (null); cada test lo cambia si necesita.
// Las consultas quedan pendientes: el permiso se ve como "cargando" y no hay actualizaciones fuera de act().
const pendiente = () => new Promise(() => {});

jest.mock('expo-camera', () => ({
  CameraView: () => null,
  Camera: {
    getCameraPermissionsAsync: jest.fn(pendiente),
    requestCameraPermissionsAsync: jest.fn(pendiente),
  },
  useCameraPermissions: jest.fn(() => [null, jest.fn(), jest.fn()]),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
}));

// El QR se dibuja con SVG nativo. En los tests alcanza con ver qué texto lleva.
jest.mock('react-native-qrcode-svg', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    __esModule: true,
    default: ({ value }: { value: string }) => <Text>{`qr:${value}`}</Text>,
  };
});

// En Node no hay GPS. Por defecto el permiso queda "cargando" (null).
jest.mock('expo-location', () => ({
  useForegroundPermissions: jest.fn(() => [null, jest.fn(), jest.fn()]),
  getForegroundPermissionsAsync: jest.fn(pendiente),
  requestForegroundPermissionsAsync: jest.fn(pendiente),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Lowest: 1, Low: 2, Balanced: 3, High: 4, Highest: 5, BestForNavigation: 6 },
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
}));
