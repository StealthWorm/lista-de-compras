import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureList } from '../lib/board.js';
import { showError } from '../lib/notify.js';
import { enterWithName, loadName, watchSession } from '../lib/session.js';

export function useListSession() {
  const [listId, setListId] = useState(null);
  const [needsName, setNeedsName] = useState(false);
  const sessionRef = useRef(null);
  const joiningRef = useRef(false);

  const reportSaveError = useCallback(() => {
    showError('Não consegui salvar a lista.');
  }, []);

  const remember = useCallback((person, nextListId) => {
    sessionRef.current = {
      uid: person.uid,
      listId: nextListId,
      name: person.name,
    };
    setListId(nextListId);
    setNeedsName(false);
  }, []);

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
        .then((nextListId) => remember({ uid: user.uid, name }, nextListId))
        .catch(reportSaveError);
    });
  }, [remember, reportSaveError]);

  async function enter(name) {
    joiningRef.current = true;
    try {
      const person = await enterWithName(name);
      remember(person, await ensureList(person));
    } finally {
      joiningRef.current = false;
    }
  }

  return { listId, needsName, sessionRef, enter, reportSaveError };
}
