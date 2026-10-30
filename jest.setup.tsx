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

// El selector de fotos y la cámara del sistema no existen en Node.
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  getMediaLibraryPermissionsAsync: jest.fn(),
}));

// Por defecto, la lectura queda pendiente: se ven los datos iniciales y no hay updates fuera de act().
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(pendiente),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
}));

// Las notificaciones las maneja el sistema operativo: en Node solo verifico cómo se las pido.
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(pendiente),
  requestPermissionsAsync: jest.fn(pendiente),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id-simulado'),
  useLastNotificationResponse: jest.fn(() => undefined),
  clearLastNotificationResponseAsync: jest.fn().mockResolvedValue(undefined),
  DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
  AndroidImportance: { HIGH: 5 },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  IosAuthorizationStatus: { NOT_DETERMINED: 0, DENIED: 1, AUTHORIZED: 2, PROVISIONAL: 3 },
}));
