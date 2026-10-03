import { useRef, useState } from 'react';
import { parseQty } from '../../lib/list.js';
import { dismissError, showError } from '../../lib/notify.js';
import { Field } from '../Field/Field.jsx';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton.jsx';
import './AddItemForm.css';

export function AddItemForm({ onAdd }) {
  const [draftName, setDraftName] = useState('');
  const [draftQty, setDraftQty] = useState('1');
  const [invalidField, setInvalidField] = useState('');
  const nameRef = useRef(null);
  const qtyRef = useRef(null);

  function reject(field, message, node) {
    setInvalidField(field);
    showError(message);
    node?.focus();
  }

  function clearInvalid() {
    if (!invalidField) return;
    setInvalidField('');
    dismissError();
  }

  function submit(event) {
    event.preventDefault();
    const name = draftName.trim();
    const qty = parseQty(draftQty);
    if (!name) {
      reject(
        'name',
        'Escreva o nome do item antes de adicionar.',
        nameRef.current,
      );
      return;
    }
    if (qty == null) {
      reject(
        'qty',
        'A quantidade precisa ser um número de 1 a 99.',
        qtyRef.current,
      );
      return;
    }
    if (!onAdd({ name, qty })) return;
    setDraftName('');
    setDraftQty('1');
    setInvalidField('');
    dismissError();
    nameRef.current?.focus();
  }

  return (
    <form className="add-item-form" onSubmit={submit}>
      <div className="add-item-fields">
        <Field
          id="item-name"
          label="Item"
          inputRef={nameRef}
          value={draftName}
          placeholder="Arroz, leite, banana…"
          autoComplete="off"
          enterKeyHint="next"
          aria-invalid={invalidField === 'name' ? 'true' : undefined}
          onChange={(event) => {
            setDraftName(event.target.value);
            clearInvalid();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              qtyRef.current?.focus();
            }
          }}
        />
        <Field
          id="item-qty"
          label={
            <>
              <span className="qty-short">Qtd</span>
              <span className="qty-long">Quantidade</span>
            </>
          }
          inputRef={qtyRef}
          inputClassName="qty-input"
          value={draftQty}
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="done"
          maxLength={2}
          aria-invalid={invalidField === 'qty' ? 'true' : undefined}
          onChange={(event) => {
            setDraftQty(event.target.value.replace(/\D/g, '').slice(0, 2));
            clearInvalid();
          }}
        />
      </div>
      <PrimaryButton>Adicionar</PrimaryButton>
    </form>
  );
}
