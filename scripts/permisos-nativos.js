// Muestra cómo quedarían los permisos nativos sin compilar: corre los plugins con
// `expo config --type introspect` y lista las claves de iOS y los permisos de Android.
const { execSync } = require('child_process');
const path = require('path');

function leerPermisosNativos() {
  const salida = execSync('npx expo config --type introspect --json', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 20 * 1024 * 1024,
  });
  const config = JSON.parse(salida);
  const infoPlist = config._internal?.modResults?.ios?.infoPlist ?? {};
  const manifiesto = config._internal?.modResults?.android?.manifest?.manifest ?? {};

  const ios = Object.fromEntries(
    Object.entries(infoPlist).filter(([clave]) => clave.endsWith('UsageDescription')),
  );
  const android = (manifiesto['uses-permission'] ?? []).map((p) => ({
    nombre: p.$['android:name'],
    quitado: p.$['tools:node'] === 'remove',
  }));

  return { ios, android, modosSegundoPlano: infoPlist.UIBackgroundModes ?? [] };
}

module.exports = { leerPermisosNativos };

if (require.main === module) {
  const { ios, android, modosSegundoPlano } = leerPermisosNativos();
  console.log('iOS (Info.plist):');
  for (const [clave, texto] of Object.entries(ios)) console.log(`  ${clave}: ${texto}`);
  console.log('Android (AndroidManifest.xml):');
  for (const { nombre, quitado } of android) {
    console.log(`  ${quitado ? '[bloqueado] ' : ''}${nombre}`);
  }
  console.log('iOS UIBackgroundModes:', JSON.stringify(modosSegundoPlano));
}
