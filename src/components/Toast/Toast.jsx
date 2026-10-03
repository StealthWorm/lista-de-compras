import { X } from 'lucide-react';
import { Slide, ToastContainer } from 'react-toastify';
import './Toast.css';

function CloseButton({ closeToast }) {
  return (
    <button
      type="button"
      className="Toastify__close-button"
      aria-label="Fechar"
      onClick={closeToast}
    >
      <X aria-hidden="true" />
    </button>
  );
}

export function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={4200}
      limit={1}
      closeOnClick
      closeButton={CloseButton}
      pauseOnHover
      draggable={false}
      transition={Slide}
      theme="light"
      aria-label="Avisos"
    />
  );
}
