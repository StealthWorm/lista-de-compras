import './Field.css';

export function Field({
  id,
  label,
  inputRef,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  const fieldClass = className ? `field ${className}` : 'field';
  const inputClass = inputClassName
    ? `text-input ${inputClassName}`
    : 'text-input';

  return (
    <div className={fieldClass}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        className={inputClass}
        {...inputProps}
      />
    </div>
  );
}
