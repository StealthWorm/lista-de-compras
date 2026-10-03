import { useState } from 'react';
import { initial } from '../../lib/session.js';
import './ActiveShoppers.css';

export function ActiveShoppers({ people }) {
  const [openId, setOpenId] = useState(null);
  if (people.length === 0) return null;

  const openPerson = people.find((person) => person.id === openId);

  return (
    <div className="active-shoppers-wrap">
      <ul className="active-shoppers">
        {people.map((person, index) => {
          const open = openId === person.id;
          return (
            <li
              key={person.id}
              className={open ? 'is-open' : undefined}
              style={{ '--shopper-index': index }}
            >
              <button
                type="button"
                className="shopper-mark"
                aria-pressed={open}
                aria-label={person.name}
                onClick={() => setOpenId(open ? null : person.id)}
              >
                {initial(person.name)}
              </button>
            </li>
          );
        })}
      </ul>
      {openPerson ? (
        <p className="shopper-name">{openPerson.name}</p>
      ) : null}
    </div>
  );
}
