import {
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase.js';

const NAME_KEY = 'lista-de-compras-nome';

export function initial(name) {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toLocaleUpperCase('pt-BR') : '?';
}

export function loadName() {
  return localStorage.getItem(NAME_KEY)?.trim() ?? '';
}

export function watchSession(onUser) {
  return onAuthStateChanged(auth, onUser);
}

export async function enterWithName(name) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Diga como te chamam nesta lista.');
  const credential = auth.currentUser
    ? { user: auth.currentUser }
    : await signInAnonymously(auth);
  await updateProfile(credential.user, { displayName: trimmed });
  localStorage.setItem(NAME_KEY, trimmed);
  return { uid: credential.user.uid, name: trimmed };
}
