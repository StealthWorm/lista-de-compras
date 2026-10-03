import { toast } from "react-toastify"

const TOAST_ID = "lista-erro"

export function showError(message) {
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, {
      render: message,
      type: "error",
      autoClose: 4200,
    })
    return
  }
  toast.error(message, { toastId: TOAST_ID })
}

export function dismissError() {
  toast.dismiss(TOAST_ID)
}
