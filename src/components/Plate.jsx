import { useState } from 'react';
import { tally } from '../lib/list.js';
import { initial } from '../lib/session.js';

export function Plate({ count, people = [], onCopyLink, copied = false }) {
  return (
    <header className="plate">
      <div className="column plate-row">
        <div>
          <h1>Lista de Compras</h1>
          {count == null ? null : <p className="tally">{tally(count)}</p>}
          {onCopyLink ? (
            <button type="button" className="plate-link" onClick={onCopyLink}>
              {copied ? 'Link copiado' : 'Copiar link'}
            </button>
          ) : null}
        </div>
        <Presence people={people} />
      </div>
    </header>
  );
}

function Presence({ people }) {
  const [openId, setOpenId] = useState(null);
  if (people.length === 0) return null;

  return (
    <ul className="presence">
      {people.map((person) => {
        const open = openId === person.id;
        return (
          <li key={person.id} title={person.name}>
            <button
              type="button"
              className="presence-mark"
              aria-pressed={open}
              aria-label={person.name}
              onClick={() => setOpenId(open ? null : person.id)}
            >
              {initial(person.name)}
            </button>
            {open ? <span className="presence-name">{person.name}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}
