// Los íconos cargan una fuente de forma asíncrona y eso genera avisos de act() en los tests.
// Los reemplazo por un componente vacío: en los tests no importa cómo se ve el ícono.
jest.mock('@expo/vector-icons/Ionicons', () => {
  const Icono = () => null;
  Icono.glyphMap = {};
  return { __esModule: true, default: Icono };
});
