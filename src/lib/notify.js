import { toast } from "react-toastify"

const TOAST_ID = "lista-aviso"

function showToast(message, type) {
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, {
      render: message,
      type,
      autoClose: 4200,
    })
    return
  }
  toast[type](message, { toastId: TOAST_ID })
}

export function showError(message) {
  showToast(message, "error")
}

export function showSuccess(message) {
  showToast(message, "success")
}

export function dismissError() {
  toast.dismiss(TOAST_ID)
}
