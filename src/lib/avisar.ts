import { Alert, Platform } from 'react-native';

/** Muestra un aviso. Hace falta porque en web `Alert.alert` no muestra nada. */
export function avisar(titulo: string, mensaje: string): void {
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${titulo}\n\n${mensaje}`);
    return;
  }
  Alert.alert(titulo, mensaje);
}
