import appJson from '../../app.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { leerPermisosNativos } = require('../../scripts/permisos-nativos') as {
  leerPermisosNativos: () => {
    ios: Record<string, string>;
    android: { nombre: string; quitado: boolean }[];
    modosSegundoPlano: string[];
  };
};

const BLOQUEADOS = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_MEDIA_AUDIO',
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.RECORD_AUDIO',
];

// Los únicos permisos que la app declara en Android.
const PERMITIDOS_ANDROID = [
  'android.permission.INTERNET',
  'android.permission.VIBRATE',
  'android.permission.CAMERA',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
];

describe('app.json: permisos bloqueados', () => {
  it('bloquea cada permiso que la app no usa', () => {
    expect([...appJson.expo.android.blockedPermissions].sort()).toEqual([...BLOQUEADOS].sort());
  });

  it('no agrega permisos a mano con android.permissions', () => {
    expect(JSON.stringify(appJson.expo.android)).not.toContain('"permissions"');
  });
});

describe('Manifiesto y Info.plist generados (expo config --type introspect)', () => {
  // Corre los plugins de verdad, así que tarda unos segundos.
  const nativos = leerPermisosNativos();

  it('en Android solo quedan los permisos que la app usa', () => {
    const activos = nativos.android.filter((p) => !p.quitado).map((p) => p.nombre);

    expect(activos.sort()).toEqual([...PERMITIDOS_ANDROID].sort());
  });

  it('cada permiso bloqueado aparece con tools:node="remove"', () => {
    const quitados = nativos.android.filter((p) => p.quitado).map((p) => p.nombre);

    expect(quitados.sort()).toEqual([...BLOQUEADOS].sort());
  });

  it('en iOS solo hay textos de cámara y ubicación en uso', () => {
    expect(Object.keys(nativos.ios).sort()).toEqual([
      'NSCameraUsageDescription',
      'NSLocationWhenInUseUsageDescription',
    ]);
  });

  it('iOS no tiene modos de segundo plano', () => {
    expect(nativos.modosSegundoPlano).toEqual([]);
  });
});
