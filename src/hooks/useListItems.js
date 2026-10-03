import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  patchItem,
  putItem,
  removeCloudItem,
  saveOrder,
  seedItems,
  watchItems,
} from '../lib/board.js';
import { loadItems } from '../lib/list.js';
import { dismissError, showError } from '../lib/notify.js';

function note(by, type, itemName) {
  return { by, type, itemName };
}

export function useListItems(listId, sessionRef, reportSaveError) {
  const reduce = useReducedMotion();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [nameInvalid, setNameInvalid] = useState(false);
  const editingRef = useRef(null);
  const editInputRef = useRef(null);
  const pendingScroll = useRef(null);
  const orderKey = useRef(null);

  editingRef.current = editing;

  const onOrder = useCallback(
    (ids) => {
      const session = sessionRef.current;
      if (!session || ids.length === 0) return;
      const key = ids.join('|');
      if (orderKey.current == null) {
        orderKey.current = key;
        return;
      }
      if (key === orderKey.current) return;
      orderKey.current = key;
      saveOrder(session.listId, ids).catch(() => {
        orderKey.current = '';
        reportSaveError();
      });
    },
    [reportSaveError, sessionRef],
  );

  useEffect(() => {
    if (!listId) return undefined;
    orderKey.current = null;
    let unsubscribe = () => {};
    let cancel = false;
    const uid = sessionRef.current?.uid;
    if (!uid) return undefined;
    seedItems(listId, uid, loadItems())
      .catch(reportSaveError)
      .finally(() => {
        if (cancel) return;
        unsubscribe = watchItems(listId, setItems, reportSaveError);
      });
    return () => {
      cancel = true;
      unsubscribe();
    };
  }, [listId, reportSaveError, sessionRef]);

  useEffect(() => {
    const id = pendingScroll.current;
    if (!id) return;
    pendingScroll.current = null;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [items, reduce]);

  function commitEditing() {
    const current = editingRef.current;
    if (!current) return true;
    const next = current.draft.trim();
    if (!next) {
      setNameInvalid(true);
      showError('O item precisa de um nome.');
      requestAnimationFrame(() => editInputRef.current?.focus());
      return false;
    }
    const session = sessionRef.current;
    if (!session) {
      showError('A lista ainda está abrindo.');
      return false;
    }
    setItems((list) =>
      list.map((item) =>
        item.id === current.id ? { ...item, name: next } : item,
      ),
    );
    patchItem(
      session.listId,
      current.id,
      session.uid,
      { name: next },
      note(session.name, 'renamed', next),
    ).catch(reportSaveError);
    cancelEditing();
    return true;
  }

  function cancelEditing() {
    editingRef.current = null;
    setEditing(null);
    setNameInvalid(false);
    dismissError();
  }

  function addItem({ name, qty }) {
    if (!commitEditing()) return false;
    const session = sessionRef.current;
    if (!session) return false;
    const item = {
      id: crypto.randomUUID(),
      name,
      qty,
      picked: false,
    };
    pendingScroll.current = item.id;
    setItems((list) => [...list, item]);
    putItem(
      session.listId,
      item,
      session.uid,
      items.length,
      session.name,
    ).catch(() => {
      setItems((list) => list.filter((entry) => entry.id !== item.id));
      reportSaveError();
    });
    return true;
  }

  function startEdit(item) {
    if (item.picked) return;
    if (editingRef.current?.id === item.id) return;
    if (!commitEditing()) return;
    setEditing({ id: item.id, draft: item.name });
  }

  function removeItem(id) {
    if (editingRef.current?.id === id) cancelEditing();
    const session = sessionRef.current;
    const item = items.find((entry) => entry.id === id);
    if (!session || !item) return;
    setItems((list) => list.filter((entry) => entry.id !== id));
    removeCloudItem(
      session.listId,
      id,
      note(session.name, 'removed', item.name),
    ).catch(reportSaveError);
  }

  function changeQty(id, qty) {
    const session = sessionRef.current;
    const item = items.find((entry) => entry.id === id);
    if (!session || !item || item.picked) return;
    setItems((list) =>
      list.map((entry) => (entry.id === id ? { ...entry, qty } : entry)),
    );
    patchItem(
      session.listId,
      id,
      session.uid,
      { qty },
      note(session.name, 'qty', item.name),
    ).catch(reportSaveError);
  }

  function togglePicked(id) {
    if (editingRef.current && !commitEditing()) return;
    const session = sessionRef.current;
    const item = items.find((entry) => entry.id === id);
    if (!session || !item) return;
    const picked = !item.picked;
    setItems((list) =>
      list.map((entry) => (entry.id === id ? { ...entry, picked } : entry)),
    );
    patchItem(
      session.listId,
      id,
      session.uid,
      { picked },
      note(session.name, picked ? 'picked' : 'unpicked', item.name),
    ).catch(reportSaveError);
  }

  function onDraft(draft) {
    setEditing((current) => (current ? { ...current, draft } : current));
    if (nameInvalid) {
      setNameInvalid(false);
      dismissError();
    }
  }

  return {
    items,
    editing,
    nameInvalid,
    editInputRef,
    addItem,
    startEdit,
    removeItem,
    changeQty,
    togglePicked,
    onOrder,
    onDraft,
    commitEditing,
    cancelEditing,
  };
}
