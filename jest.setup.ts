// Los íconos cargan una fuente de forma asíncrona y eso genera avisos de act() en los tests.
// Los reemplazo por un componente vacío: en los tests no importa cómo se ve el ícono.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const Icono = () => null;
  Icono.glyphMap = {};
  return { __esModule: true, default: Icono };
});

// En Node no hay cámara. Por defecto el permiso queda "cargando" (null); cada test lo cambia si necesita.
jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: jest.fn(() => [null, jest.fn(), jest.fn()]),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
}));
