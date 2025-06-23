// components/NotificationProvider.tsx

import React from 'react'
import { Toaster, toast } from 'react-hot-toast'

export default function NotificationProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // green-500
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

// Funciones utilitarias
export const notifySuccess = (msg) => toast.success(msg)
export const notifyError = (msg) => toast.error(msg)
export const notifyWarning = (msg) =>
  toast(msg, { icon: '⚠️', style: { color: '#92400e' } })
