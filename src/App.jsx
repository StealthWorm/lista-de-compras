import { useEffect, useState } from 'react';
import { AddItemForm } from './components/AddItemForm/AddItemForm.jsx';
import { EventLog } from './components/EventLog/EventLog.jsx';
import { Header } from './components/Header/Header.jsx';
import { NameEntry } from './components/NameEntry/NameEntry.jsx';
import { ShoppingList } from './components/ShoppingList/ShoppingList.jsx';
import { Toast } from './components/Toast/Toast.jsx';
import { useListItems } from './hooks/useListItems.js';
import { useListSession } from './hooks/useListSession.js';
import { usePresence } from './hooks/usePresence.js';
import { clearActivity, watchActivity } from './lib/board.js';

export default function App() {
  const { listId, needsName, sessionRef, enter, reportSaveError } =
    useListSession();
  const people = usePresence(listId, sessionRef);
  const {
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
  } = useListItems(listId, sessionRef, reportSaveError);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!listId) return undefined;
    return watchActivity(listId, setActivity);
  }, [listId]);

  return (
    <main>
      <Header
        count={listId ? items.length : null}
        people={people}
        canCopy={Boolean(listId)}
      >
        {needsName ? <NameEntry onEnter={enter} /> : null}
        {listId ? (
          <>
            <AddItemForm onAdd={addItem} />
            <EventLog
              lines={activity}
              onClear={() => {
                const session = sessionRef.current;
                if (!session) return;
                clearActivity(session.listId).catch(reportSaveError);
              }}
            />
            <ShoppingList
              items={items}
              editing={editing}
              nameInvalid={nameInvalid}
              editInputRef={editInputRef}
              onStartEdit={startEdit}
              onDraft={onDraft}
              onCommit={commitEditing}
              onCancel={cancelEditing}
              onRemove={removeItem}
              onTogglePicked={togglePicked}
              onQty={changeQty}
              onOrder={onOrder}
            />
          </>
        ) : null}
      </Header>
      <Toast />
    </main>
  );
}
