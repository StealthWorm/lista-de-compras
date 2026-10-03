import { IconCheck, IconEdit, IconGrip } from "./icons.jsx"
import { Stepper } from "./Stepper.jsx"

function PickedSeal({ maskId }) {
  return (
    <>
      <svg className="picked-frame" width="100%" height="100%" aria-hidden="true">
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-40%" y="-70%" width="180%" height="200%">
          <rect x="-40%" y="-70%" width="180%" height="200%" fill="#fff" />
          <circle className="picked-disk-cut" fill="#000" />
        </mask>
        <rect className="picked-plate picked-ring" x="0" y="0" mask={`url(#${maskId})`} />
        <circle className="picked-disk picked-ring picked-disk-fill" />
      </svg>
      <span className="picked-check">
        <IconCheck />
      </span>
    </>
  )
}

export function ShoppingItem({
  item,
  itemId,
  isEditing,
  draft,
  rowError,
  editInputRef,
  onDraft,
  onStartEdit,
  onCommit,
  onCancel,
  onRemove,
  onTogglePicked,
  onQty,
}) {
  const picked = item.picked === true

  return (
    <article className={picked ? "badge is-picked" : "badge"} data-swapy-item={itemId}>
      {picked ? <PickedSeal maskId={`picked-rim-${item.id}`} /> : null}

      <div className="grip" data-swapy-handle aria-hidden="true">
        <IconGrip />
      </div>

      <div className="badge-copy" data-swapy-no-drag>
        {picked ? (
          <p className="name">
            <span>{item.name}</span>
            <span className="sr">selecionado</span>
          </p>
        ) : isEditing ? (
          <input
            ref={editInputRef}
            className="name-input"
            value={draft}
            aria-label={`Nome de ${item.name}`}
            aria-invalid={rowError ? "true" : undefined}
            autoFocus
            enterKeyHint="done"
            onChange={(event) => onDraft(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onCommit()
              }
              if (event.key === "Escape") onCancel()
            }}
          />
        ) : (
          <button type="button" className="name" aria-label={`Editar nome: ${item.name}`} onClick={onStartEdit}>
            <span>{item.name}</span>
            <IconEdit />
          </button>
        )}
        <div className="badge-actions">
          <button
            type="button"
            className="remove"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onRemove}
          >
            Remover
          </button>
          <button
            type="button"
            className="mark"
            aria-pressed={picked}
            aria-label={picked ? `Desmarcar ${item.name}` : `Marcar ${item.name} como selecionado`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onTogglePicked}
          >
            OK
          </button>
        </div>
      </div>

      <div data-swapy-no-drag>
        <Stepper value={item.qty} onChange={onQty} itemName={item.name} disabled={picked} />
      </div>
    </article>
  )
}
