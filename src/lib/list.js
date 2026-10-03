const STORAGE_KEY = 'lista-de-compras';
export const MIN_QTY = 1;
export const MAX_QTY = 99;
export const EASE = [0.16, 1, 0.3, 1];

export function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item.id !== 'string' || typeof item.name !== 'string')
        return [];
      const name = item.name.trim();
      const qty = Number(item.qty);
      if (!name || !Number.isInteger(qty) || qty < MIN_QTY || qty > MAX_QTY)
        return [];
      return [{ id: item.id, name, qty, picked: item.picked === true }];
    });
  } catch {
    return [];
  }
}

export function quantityOfItems(count) {
  if (count === 0) return 'Nenhum item';
  if (count === 1) return '1 item';
  return `${count} itens`;
}

export function parseQty(value) {
  if (!/^\d{1,2}$/.test(value)) return null;
  const qty = Number(value);
  if (qty < MIN_QTY || qty > MAX_QTY) return null;
  return qty;
}
