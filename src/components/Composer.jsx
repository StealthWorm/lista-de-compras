import { useRef, useState } from "react"
import { parseQty } from "../lib/list.js"
import { dismissError, showError } from "../lib/notify.js"

export function Composer({ onAdd }) {
  const [draftName, setDraftName] = useState("")
  const [draftQty, setDraftQty] = useState("1")
  const [formError, setFormError] = useState("")
  const nameRef = useRef(null)
  const qtyRef = useRef(null)

  function submit(event) {
    event.preventDefault()
    const name = draftName.trim()
    const qty = parseQty(draftQty)
    if (!name) {
      setFormError("Escreva o nome do item antes de adicionar.")
      showError("Escreva o nome do item antes de adicionar.")
      nameRef.current?.focus()
      return
    }
    if (qty == null) {
      setFormError("A quantidade precisa ser um número de 1 a 99.")
      showError("A quantidade precisa ser um número de 1 a 99.")
      qtyRef.current?.focus()
      return
    }
    if (!onAdd({ name, qty })) return
    setDraftName("")
    setDraftQty("1")
    setFormError("")
    dismissError()
    nameRef.current?.focus()
  }

  return (
    <form className="composer" onSubmit={submit}>
      <div className="composer-fields">
        <div className="field">
          <label className="field-label" htmlFor="item-name">
            Item
          </label>
          <input
            id="item-name"
            ref={nameRef}
            className="item-input"
            value={draftName}
            placeholder="Arroz, leite, banana…"
            autoComplete="off"
            enterKeyHint="next"
                aria-invalid={formError && !draftName.trim() ? "true" : undefined}
                onChange={(event) => {
                  setDraftName(event.target.value)
                  if (formError) {
                    setFormError("")
                    dismissError()
                  }
                }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                qtyRef.current?.focus()
              }
            }}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="item-qty">
            <span className="qty-short">Qtd</span>
            <span className="qty-long">Quantidade</span>
          </label>
          <input
            id="item-qty"
            ref={qtyRef}
            className="item-input qty-input"
            value={draftQty}
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="done"
            maxLength={2}
            aria-invalid={formError && draftName.trim() && parseQty(draftQty) == null ? "true" : undefined}
            onChange={(event) => {
              setDraftQty(event.target.value.replace(/\D/g, "").slice(0, 2))
              if (formError) {
                setFormError("")
                dismissError()
              }
            }}
          />
        </div>
      </div>

      <button className="add" type="submit">
        Adicionar
      </button>
    </form>
  )
}
