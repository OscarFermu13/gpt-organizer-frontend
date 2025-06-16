import React, { useState } from 'react';
import { getTranslator } from '../lib/i18n.jsx';
import { notifyError } from '../components/notificationProvider.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com'

export default function AuthPanel() {

    t = getTranslator();

    async function startCheckout() {
    try {
      const response = await fetch(`${API_URL}/billing/checkout`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json()

      if (response.ok && data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
        notifyError(t.error_messages.upgrade);
    }
  }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h6 className="__menu-label">{t.sidebar_extension_name}</h6>
            <div className="w-full flex flex-col items-center text-center">
    <p className="text-sm text-white text-pretty">{t.upgrade.message}</p>
    
    <button
      type="button"
      onClick={startCheckout}
      className="mt-2 btn btn-primary"
    >
      {t.upgrade.btn_upgrade}
    </button>
  </div>
        </div>
    );
}
