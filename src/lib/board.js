import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';

const LIST_KEY = 'lista-de-compras-lista';

export async function ensureList({ uid, name }) {
  const params = new URLSearchParams(window.location.search);
  const listId =
    params.get('lista') ||
    localStorage.getItem(LIST_KEY) ||
    crypto.randomUUID();
  const listRef = doc(db, 'lists', listId);

  if (!(await getDoc(listRef)).exists()) {
    await setDoc(listRef, {
      createdAt: serverTimestamp(),
      createdBy: uid,
    });
  }

  const memberRef = doc(db, 'lists', listId, 'members', uid);
  const member = await getDoc(memberRef);
  await setDoc(
    memberRef,
    member.exists() ? { name } : { name, joinedAt: serverTimestamp() },
    { merge: true },
  );

  localStorage.setItem(LIST_KEY, listId);
  const url = new URL(window.location.href);
  url.searchParams.set('lista', listId);
  window.history.replaceState(null, '', url);
  return { listId, link: url.toString() };
}

const ACTIVE_MS = 45_000;

export function beat(listId, uid) {
  return updateDoc(doc(db, 'lists', listId, 'members', uid), {
    lastSeen: serverTimestamp(),
  });
}

export function watchMembers(listId, onMembers) {
  return onSnapshot(collection(db, 'lists', listId, 'members'), (snap) => {
    onMembers(
      snap.docs.map((member) => {
        const data = member.data();
        return {
          id: member.id,
          name: data.name || 'Alguém',
          seenAt: data.lastSeen?.toMillis?.() ?? 0,
        };
      }),
    );
  });
}

export function activeMembers(members, now = Date.now(), selfId) {
  return members
    .filter((person) => now - person.seenAt < ACTIVE_MS)
    .sort((a, b) => {
      if (selfId && a.id === selfId) return -1;
      if (selfId && b.id === selfId) return 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
}

export async function seedItems(listId, uid, items) {
  const col = collection(db, 'lists', listId, 'items');
  if (!(await getDocs(col)).empty || items.length === 0) return;
  await Promise.all(
    items.map((item, position) =>
      setDoc(doc(col, item.id), {
        name: item.name,
        qty: item.qty,
        picked: item.picked === true,
        position,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      }),
    ),
  );
}

// onSnapshot, e não uma pipeline: a família precisa ver a lista mudar na hora.
export function watchItems(listId, onItems, onError) {
  return onSnapshot(
    collection(db, 'lists', listId, 'items'),
    (snap) => {
      const items = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      items.sort(
        (a, b) =>
          (a.position ?? 0) - (b.position ?? 0) || a.id.localeCompare(b.id),
      );
      onItems(
        items.map(({ id, name, qty, picked }) => ({
          id,
          name,
          qty,
          picked: picked === true,
        })),
      );
    },
    onError,
  );
}

function queueNote(batch, listId, note) {
  if (!note) return;
  batch.set(doc(collection(db, 'lists', listId, 'activity')), {
    by: note.by,
    type: note.type,
    itemName: note.itemName,
    at: serverTimestamp(),
  });
}

export function putItem(listId, item, uid, position, by) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'lists', listId, 'items', item.id), {
    name: item.name,
    qty: item.qty,
    picked: item.picked === true,
    position,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
  queueNote(batch, listId, { by, type: 'added', itemName: item.name });
  return batch.commit();
}

export function patchItem(listId, itemId, uid, patch, note) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'lists', listId, 'items', itemId), {
    ...patch,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
  queueNote(batch, listId, note);
  return batch.commit();
}

export function removeCloudItem(listId, itemId, note) {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'lists', listId, 'items', itemId));
  queueNote(batch, listId, note);
  return batch.commit();
}

export async function clearActivity(listId) {
  const snap = await getDocs(collection(db, 'lists', listId, 'activity'));
  const docs = snap.docs;
  for (let index = 0; index < docs.length; index += 400) {
    const batch = writeBatch(db);
    docs.slice(index, index + 400).forEach((entry) => batch.delete(entry.ref));
    await batch.commit();
  }
}

export function watchActivity(listId, onLines) {
  const recent = query(
    collection(db, 'lists', listId, 'activity'),
    orderBy('at', 'desc'),
    limit(30),
  );
  return onSnapshot(recent, (snap) => {
    onLines(
      snap.docs
        .map((entry) => {
          const data = entry.data();
          return { id: entry.id, text: phrase(data) };
        })
        .filter((entry) => entry.text),
    );
  });
}

function phrase({ by, type, itemName }) {
  if (type === 'added') return `${by} incluiu ${itemName}`;
  if (type === 'renamed') return `${by} editou ${itemName}`;
  if (type === 'qty') return `${by} alterou a quantidade de ${itemName}`;
  if (type === 'picked') return `${by} marcou ${itemName} como OK`;
  if (type === 'unpicked') return `${by} desmarcou ${itemName}`;
  if (type === 'removed') return `${by} removeu ${itemName}`;
  return '';
}

export function saveOrder(listId, ids) {
  return Promise.all(
    ids.map((id, position) =>
      updateDoc(doc(db, 'lists', listId, 'items', id), { position }),
    ),
  );
}
