import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react"
import { createSwapy, utils } from "swapy"
import { ShoppingItem } from "./ShoppingItem.jsx"

function ItemRow({ slotId, rowId, enter, children }) {
  const present = useIsPresent()
  const [playing, setPlaying] = useState(enter)
  const reveal = playing && present

  return (
    <motion.li
      id={rowId}
      layout={false}
      className={reveal ? "row row-enter" : "row"}
      data-swapy-slot={slotId}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.animationName !== "row-reveal") return
        setPlaying(false)
      }}
    >
      {children}
    </motion.li>
  )
}

function sameMap(current, next) {
  return (
    current.length === next.length &&
    current.every((entry, index) => entry.slot === next[index].slot && entry.item === next[index].item)
  )
}

export function ItemList({
  items,
  editing,
  rowError,
  editInputRef,
  onStartEdit,
  onDraft,
  onCommit,
  onCancel,
  onRemove,
  onTogglePicked,
  onQty,
  onOrder,
}) {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const swapyRef = useRef(null)
  const [slotItemMap, setSlotItemMap] = useState(() => utils.initSlotItemMap(items, "id"))

  const setMap = useRef((next) => {
    setSlotItemMap((current) => (sameMap(current, next) ? current : next))
  }).current

  const mapRef = useRef(slotItemMap)
  mapRef.current = slotItemMap

  const slottedItems = useMemo(() => {
    const slotted = utils.toSlottedItems(items, "id", slotItemMap).filter((entry) => entry.item)
    const seen = new Set(slotted.map((entry) => entry.item.id))
    const missing = items
      .filter((item) => !seen.has(item.id))
      .map((item) => ({ slotId: item.id, itemId: item.id, item }))
    return [...slotted, ...missing]
  }, [items, slotItemMap])

  const active = slottedItems.length > 0

  useEffect(() => {
    if (!active || !containerRef.current) return undefined
    const swapy = createSwapy(containerRef.current, {
      animation: "dynamic",
      manualSwap: true,
      dragAxis: "y",
      autoScrollOnDrag: true,
      swapMode: "hover",
    })
    swapyRef.current = swapy
    swapy.onSwap((event) => {
      setMap(event.newSlotItemMap.asArray)
    })
    return () => {
      swapy.destroy()
      if (swapyRef.current === swapy) swapyRef.current = null
    }
  }, [active, setMap])

  useEffect(() => {
    utils.dynamicSwapy(swapyRef.current, items, "id", mapRef.current, setMap)
  }, [items, setMap])

  useEffect(() => {
    onOrder?.(slottedItems.map((entry) => entry.item.id))
  }, [slottedItems, onOrder])

  const skipEnter = useRef(true)
  useEffect(() => {
    skipEnter.current = false
  }, [])

  if (!active) {
    return (
      <p className="empty">A lista está vazia. Escreva o item, informe a quantidade e toque em Adicionar.</p>
    )
  }

  return (
    <ul className="list" ref={containerRef}>
      <AnimatePresence initial={false}>
        {slottedItems.map(({ slotId, itemId, item }) => {
          const isEditing = editing?.id === item.id
          return (
            <ItemRow key={slotId} slotId={slotId} rowId={item.id} enter={!reduce && !skipEnter.current}>
              <ShoppingItem
                item={item}
                itemId={itemId}
                isEditing={isEditing}
                draft={isEditing ? editing.draft : item.name}
                rowError={rowError}
                editInputRef={isEditing ? editInputRef : undefined}
                onDraft={onDraft}
                onStartEdit={() => onStartEdit(item)}
                onCommit={onCommit}
                onCancel={onCancel}
                onRemove={() => onRemove(item.id)}
                onTogglePicked={() => onTogglePicked(item.id)}
                onQty={(qty) => onQty(item.id, qty)}
              />
            </ItemRow>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
