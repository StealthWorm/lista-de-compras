import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { EASE, MAX_QTY, MIN_QTY } from "../lib/list.js"
import { IconMinus, IconPlus } from "./icons.jsx"

export function Stepper({ value, onChange, labelledBy, itemName, disabled = false }) {
  const reduce = useReducedMotion()
  const previous = useRef(value)
  const direction = value === previous.current ? 1 : value > previous.current ? 1 : -1

  useEffect(() => {
    previous.current = value
  }, [value])

  const subject = itemName ? ` de ${itemName}` : ""

  return (
    <div
      className="stepper"
      role="group"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : `Quantidade${subject}`}
      aria-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="stepper-btn"
        aria-label={`Aumentar quantidade${subject}`}
        disabled={disabled || value >= MAX_QTY}
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
      >
        <IconPlus />
      </button>
      <span className="stepper-value" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            className="stepper-digit"
            initial={reduce ? false : { y: direction > 0 ? 12 : -12, opacity: 0, filter: "blur(3px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { y: direction > 0 ? -12 : 12, opacity: 0, filter: "blur(3px)" }}
            transition={{ type: "tween", duration: reduce ? 0.01 : 0.28, ease: EASE }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        className="stepper-btn"
        aria-label={`Diminuir quantidade${subject}`}
        disabled={disabled || value <= MIN_QTY}
        onClick={() => onChange(Math.max(MIN_QTY, value - 1))}
      >
        <IconMinus />
      </button>
    </div>
  )
}
