import { useRef, useState } from 'react';
import { dismissError, showError } from '../lib/notify.js';

export function Gate({ onEnter }) {
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const nameRef = useRef(null);

  async function submit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError('Diga como te chamam nesta lista.');
      showError('Diga como te chamam nesta lista.');
      nameRef.current?.focus();
      return;
    }
    setPending(true);
    try {
      await onEnter(trimmed);
    } catch {
      setPending(false);
      setFormError('Não consegui entrar na lista.');
      showError('Não consegui entrar na lista. Tente de novo.');
      nameRef.current?.focus();
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <div className="field">
        <label className="field-label" htmlFor="person-name">
          Seu nome
        </label>
        <input
          id="person-name"
          ref={nameRef}
          className="item-input"
          value={name}
          placeholder="Como devem te chamar ?"
          autoComplete="nickname"
          autoCapitalize="words"
          enterKeyHint="done"
          maxLength={39}
          autoFocus
          aria-invalid={formError ? 'true' : undefined}
          disabled={pending}
          onChange={(event) => {
            setName(event.target.value);
            if (formError) {
              setFormError('');
              dismissError();
            }
          }}
        />
      </div>
      <p className="gate-note">
        Quem abrir o mesmo link vê esse nome na lista.
      </p>
      <button className="add" type="submit" disabled={pending}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
