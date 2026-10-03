import { useEffect, useState } from 'react';
import { activeMembers, beat, watchMembers } from '../lib/board.js';

export function usePresence(listId, sessionRef) {
  const [members, setMembers] = useState([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!listId) return undefined;
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, [listId]);

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

  return activeMembers(members, now, sessionRef.current?.uid);
}
