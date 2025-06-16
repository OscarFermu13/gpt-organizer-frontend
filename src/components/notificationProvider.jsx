import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

// Función utilitaria para disparar notificaciones
export const notifySuccess = (msg) => {
  toast.success(msg);
};

export const notifyError = (msg) => {
  toast.error(msg);
};

export const notifyInfo = (msg) => {
  toast.info(msg);
};

export const notifyWarning = (msg) => {
  toast.warning(msg);
};
