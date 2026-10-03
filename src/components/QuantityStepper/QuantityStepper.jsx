import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { EASE, MAX_QTY, MIN_QTY } from '../../lib/list.js';
import './QuantityStepper.css';

export function QuantityStepper({
  value,
  onChange,
  itemName,
  disabled = false,
}) {
  const reduce = useReducedMotion();
  const previous = useRef(value);
  const direction =
    value === previous.current ? 1 : value > previous.current ? 1 : -1;

  useEffect(() => {
    previous.current = value;
  }, [value]);

  const subject = itemName ? ` de ${itemName}` : '';

  return (
    <div
      className="quantity-stepper"
      role="group"
      aria-label={`Quantidade${subject}`}
      aria-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="quantity-stepper-btn"
        aria-label={`Aumentar quantidade${subject}`}
        disabled={disabled || value >= MAX_QTY}
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
      >
        <Plus size={22} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="quantity-stepper-value" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            className="quantity-stepper-digit"
            initial={
              reduce
                ? false
                : { y: direction > 0 ? 12 : -12, opacity: 0, filter: 'blur(3px)' }
            }
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    y: direction > 0 ? -12 : 12,
                    opacity: 0,
                    filter: 'blur(3px)',
                  }
            }
            transition={{
              type: 'tween',
              duration: reduce ? 0.01 : 0.28,
              ease: EASE,
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        className="quantity-stepper-btn"
        aria-label={`Diminuir quantidade${subject}`}
        disabled={disabled || value <= MIN_QTY}
        onClick={() => onChange(Math.max(MIN_QTY, value - 1))}
      >
        <Minus size={22} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
