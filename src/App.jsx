import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Slide, ToastContainer } from 'react-toastify';
import { Composer } from './components/Composer.jsx';
import { Gate } from './components/Gate.jsx';
import { ItemList } from './components/ItemList.jsx';
import { Plate } from './components/Plate.jsx';
import { loadItems } from './lib/list.js';
import { dismissError, showError } from './lib/notify.js';
import { enterWithName, loadName, watchSession } from './lib/session.js';
import {
  activeMembers,
  beat,
  clearActivity,
  ensureList,
  patchItem,
  putItem,
  removeCloudItem,
  saveOrder,
  seedItems,
  watchActivity,
  watchItems,
  watchMembers,
} from './lib/board.js';

export default function App() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState([]);
  const [listId, setListId] = useState(null);
  const [members, setMembers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const [needsName, setNeedsName] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkFallback, setLinkFallback] = useState('');
  const [editing, setEditing] = useState(null);
  const [rowError, setRowError] = useState('');
  const editingRef = useRef(null);
  const editInputRef = useRef(null);
  const pendingScroll = useRef(null);
  const sessionRef = useRef(null);
  const joiningRef = useRef(false);
  const orderKey = useRef('');

  editingRef.current = editing;

  const reportSaveError = useCallback(() => {
    showError('Não consegui salvar a lista.');
  }, []);

  const onOrder = useCallback((ids) => {
    const session = sessionRef.current;
    if (!session || ids.length === 0) return;
    const key = ids.join('|');
    if (key === orderKey.current) return;
    orderKey.current = key;
    saveOrder(session.listId, ids).catch(() => {
      orderKey.current = '';
      reportSaveError();
    });
  }, [reportSaveError]);

  useEffect(() => {
    return watchSession((user) => {
      if (joiningRef.current) return;
      const name = user?.displayName?.trim() || loadName();
      if (!user || !name) {
        sessionRef.current = null;
        setListId(null);
        setNeedsName(true);
        return;
      }
      ensureList({ uid: user.uid, name })
        .then((board) => {
          sessionRef.current = {
            uid: user.uid,
            listId: board.listId,
            name,
          };
          setListId(board.listId);
          setNeedsName(false);
        })
        .catch(reportSaveError);
    });
  }, [reportSaveError]);

  async function enter(name) {
    joiningRef.current = true;
    try {
      const person = await enterWithName(name);
      const board = await ensureList(person);
      sessionRef.current = {
        uid: person.uid,
        listId: board.listId,
        name: person.name,
      };
      setListId(board.listId);
      setNeedsName(false);
    } finally {
      joiningRef.current = false;
    }
  }

  async function copyLink() {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setLinkFallback('');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setLinkFallback(link);
      showError('Não consegui copiar. Segure o endereço e copie.');
    }
  }

  useEffect(() => {
    if (!listId) return undefined;
    orderKey.current = '';
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
    const stopActivity = watchActivity(listId, setActivity);
    return () => {
      cancel = true;
      unsubscribe();
      stopActivity();
    };
  }, [listId, reportSaveError]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!listId) return undefined;
    const uid = sessionRef.current?.uid;
    if (!uid) return undefined;
    const pulse = () => {
      beat(listId, uid).catch(() => {});
    };
    pulse();
    const timer = window.setInterval(pulse, 20_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') pulse();
    };
    document.addEventListener('visibilitychange', onVisible);
    const unsubscribe = watchMembers(listId, setMembers);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      unsubscribe();
    };
  }, [listId]);

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
      setRowError('O item precisa de um nome.');
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
    patchItem(session.listId, current.id, session.uid, { name: next }, {
      by: session.name,
      type: 'renamed',
      itemName: next,
    }).catch(reportSaveError);
    editingRef.current = null;
    setEditing(null);
    setRowError('');
    dismissError();
    return true;
  }

  function cancelEditing() {
    editingRef.current = null;
    setEditing(null);
    setRowError('');
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
    putItem(session.listId, item, session.uid, items.length, session.name).catch(() => {
      setItems((list) => list.filter((entry) => entry.id !== item.id));
      reportSaveError();
    });
    return true;
  }

  function startEdit(item) {
    if (item.picked) return;
    if (editingRef.current?.id === item.id) return;
    if (!commitEditing()) return;
    setRowError('');
    setEditing({ id: item.id, draft: item.name });
  }

  function removeItem(id) {
    if (editingRef.current?.id === id) cancelEditing();
    const session = sessionRef.current;
    const item = items.find((entry) => entry.id === id);
    if (!session || !item) return;
    setItems((list) => list.filter((entry) => entry.id !== id));
    removeCloudItem(session.listId, id, {
      by: session.name,
      type: 'removed',
      itemName: item.name,
    }).catch(reportSaveError);
  }

  function changeQty(id, qty) {
    const session = sessionRef.current;
    const item = items.find((entry) => entry.id === id);
    if (!session || !item || item.picked) return;
    setItems((list) =>
      list.map((entry) => (entry.id === id ? { ...entry, qty } : entry)),
    );
    patchItem(session.listId, id, session.uid, { qty }, {
      by: session.name,
      type: 'qty',
      itemName: item.name,
    }).catch(reportSaveError);
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
    patchItem(session.listId, id, session.uid, { picked }, {
      by: session.name,
      type: picked ? 'picked' : 'unpicked',
      itemName: item.name,
    }).catch(reportSaveError);
  }

  return (
    <main>
      <Plate
        count={listId ? items.length : null}
        people={activeMembers(members, now, sessionRef.current?.uid)}
        onCopyLink={listId ? copyLink : null}
        copied={copied}
      />
      <div className="sheet">
        <div className="column">
          {needsName ? <Gate onEnter={enter} /> : null}
          {linkFallback ? (
            <div className="field link-fallback">
              <label className="field-label" htmlFor="list-link">
                Link da lista
              </label>
              <input
                id="list-link"
                className="item-input"
                readOnly
                value={linkFallback}
                onFocus={(event) => event.target.select()}
              />
            </div>
          ) : null}
          {listId ? <Composer onAdd={addItem} /> : null}
          {listId ? (
          <section className="activity" aria-labelledby="activity-title">
            <div className="activity-head">
              <h2 id="activity-title">Fila de eventos</h2>
              <button
                type="button"
                className="activity-clear"
                disabled={activity.length === 0}
                onClick={() => {
                  const session = sessionRef.current;
                  if (!session) return;
                  clearActivity(session.listId).catch(reportSaveError);
                }}
              >
                Limpar
              </button>
            </div>
            <div className="activity-log" tabIndex={0}>
              {activity.length > 0 ? (
                <ul aria-live="polite">
                  {activity.map((line) => (
                    <li key={line.id}>{line.text}</li>
                  ))}
                </ul>
              ) : (
                <p>Não há eventos registrados</p>
              )}
            </div>
          </section>
          ) : null}
          {listId ? (
          <ItemList
            items={items}
            editing={editing}
            rowError={rowError}
            editInputRef={editInputRef}
            onStartEdit={startEdit}
            onDraft={(draft) => {
              setEditing((current) =>
                current ? { ...current, draft } : current,
              );
              if (rowError) {
                setRowError('');
                dismissError();
              }
            }}
            onCommit={commitEditing}
            onCancel={cancelEditing}
            onRemove={removeItem}
            onTogglePicked={togglePicked}
            onQty={changeQty}
            onOrder={onOrder}
          />
          ) : null}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={4200}
        limit={1}
        closeOnClick
        closeButton={({ closeToast }) => (
          <button
            type="button"
            className="Toastify__close-button"
            aria-label="Fechar"
            onClick={closeToast}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
        pauseOnHover
        draggable={false}
        transition={Slide}
        theme="light"
        aria-label="Avisos"
      />
    </main>
  );
}
