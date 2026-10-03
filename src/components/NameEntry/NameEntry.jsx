import { useRef, useState } from 'react';
import { Field } from '../Field/Field.jsx';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton.jsx';
import { dismissError, showError } from '../../lib/notify.js';
import './NameEntry.css';

export function NameEntry({ onEnter }) {
  const [name, setName] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [pending, setPending] = useState(false);
  const nameRef = useRef(null);

  async function submit(event) {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setInvalid(true);
      showError('Diga como te chamam nesta lista.');
      nameRef.current?.focus();
      return;
    }

    setPending(true);

    try {
      await onEnter(trimmed);
    } catch {
      setPending(false);
      setInvalid(true);
      showError('Não consegui entrar na lista. Tente de novo.');
      nameRef.current?.focus();
    }
  }

  return (
    <form className="name-entry" onSubmit={submit}>
      <Field
        id="person-name"
        label="Seu nome"
        inputRef={nameRef}
        value={name}
        placeholder="Como devem te chamar ?"
        autoComplete="nickname"
        autoCapitalize="words"
        enterKeyHint="done"
        maxLength={39}
        autoFocus
        aria-invalid={invalid ? 'true' : undefined}
        disabled={pending}
        onChange={(event) => {
          setName(event.target.value);
          if (invalid) {
            setInvalid(false);
            dismissError();
          }
        }}
      />
      <p className="name-entry-note">
        Quem abrir o mesmo link vê esse nome na lista.
      </p>
      <PrimaryButton disabled={pending}>
        {pending ? 'Entrando…' : 'Entrar'}
      </PrimaryButton>
    </form>
  );
}
