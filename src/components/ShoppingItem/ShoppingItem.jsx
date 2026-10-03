import { Check, GripHorizontal, Pencil } from 'lucide-react';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper.jsx';
import './ShoppingItem.css';

function PickedSeal({ maskId }) {
  return (
    <>
      <svg className="seal" width="100%" height="100%" aria-hidden="true">
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-40%"
          y="-70%"
          width="180%"
          height="200%"
        >
          <rect x="-40%" y="-70%" width="180%" height="200%" fill="#fff" />
          <circle className="seal-cut" fill="#000" />
        </mask>
        <rect
          className="seal-border seal-ring"
          x="0"
          y="0"
          mask={`url(#${maskId})`}
        />
        <circle className="seal-disk seal-ring seal-fill" />
      </svg>
      <span className="seal-check">
        <Check
          className="seal-check-icon"
          size={18}
          strokeWidth={2.6}
          aria-hidden="true"
        />
      </span>
    </>
  );
}

export function ShoppingItem({
  item,
  itemId,
  isEditing,
  draft,
  nameInvalid,
  editInputRef,
  onDraft,
  onStartEdit,
  onCommit,
  onCancel,
  onRemove,
  onTogglePicked,
  onQty,
}) {
  const picked = item.picked === true;

  return (
    <article
      className={picked ? 'shopping-item is-picked' : 'shopping-item'}
      data-swapy-item={itemId}
    >
      {picked ? <PickedSeal maskId={`picked-rim-${item.id}`} /> : null}

      <div className="drag-handle" data-swapy-handle aria-hidden="true">
        <GripHorizontal size={22} strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="item-body" data-swapy-no-drag>
        {picked ? (
          <p className="item-name">
            <span>{item.name}</span>
            <span className="sr">selecionado</span>
          </p>
        ) : isEditing ? (
          <input
            ref={editInputRef}
            className="item-name-input"
            value={draft}
            aria-label={`Nome de ${item.name}`}
            aria-invalid={nameInvalid ? 'true' : undefined}
            autoFocus
            enterKeyHint="done"
            onChange={(event) => onDraft(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onCommit();
              }
              if (event.key === 'Escape') onCancel();
            }}
          />
        ) : (
          <button
            type="button"
            className="item-name"
            aria-label={`Editar nome: ${item.name}`}
            onClick={onStartEdit}
          >
            <span>{item.name}</span>
            <Pencil
              className="item-edit"
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        )}
        <div className="item-actions">
          <button
            type="button"
            className="remove-item"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onRemove}
          >
            Remover
          </button>
          <button
            type="button"
            className="mark-picked"
            aria-pressed={picked}
            aria-label={
              picked
                ? `Desmarcar ${item.name}`
                : `Marcar ${item.name} como selecionado`
            }
            onMouseDown={(event) => event.preventDefault()}
            onClick={onTogglePicked}
          >
            OK
          </button>
        </div>
      </div>

      <div data-swapy-no-drag>
        <QuantityStepper
          value={item.qty}
          onChange={onQty}
          itemName={item.name}
          disabled={picked}
        />
      </div>
    </article>
  );
}
