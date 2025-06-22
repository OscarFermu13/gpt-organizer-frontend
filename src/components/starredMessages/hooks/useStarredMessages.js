import { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from '../../notificationProvider';
import { getTranslator } from '../../../lib/i18n';

const API_URL = 'https://gpt-organizer-backend.onrender.com'

const t = getTranslator();

export function useSavedMessages(chatId) {
  const [savedMessages, setSavedMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/messages?chatId=${encodeURIComponent(chatId)}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setSavedMessages(data);
    } catch (err) {
      notifyError('Failed to fetch starred messages');
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (messageIndex, text) => {
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ chatId, messageIndex, text })
      });
      if (!res.ok) throw new Error('Failed to save message');
      const data = await res.json();
      setSavedMessages(prev => [...prev, data]);
      window.dispatchEvent(new CustomEvent('messagesUpdated', {
        detail: {state: 'open'}
      }));
      notifySuccess(t.success_messages.message_saved);
    } catch (err) {
      notifyError(t.error_messages.message_saved);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setSavedMessages(prev => prev.filter(m => m.id !== id));
      window.dispatchEvent(new CustomEvent('messagesUpdated', {
        detail: {state: 'close'}
      }));
      notifySuccess(t.success_messages.message_deleted);
    } catch (err) {
      notifyError(t.error_messages.message_deleted);
    }
  };

  useEffect(() => {
    fetchSavedMessages();
    const handleUpdate = () => {
      fetchSavedMessages();
    };
    window.addEventListener('messagesUpdated', handleUpdate);
    return () => window.removeEventListener('messagesUpdated', handleUpdate);
  }, [chatId]);

  return {
    savedMessages,
    loading,
    fetchSavedMessages,
    saveMessage,
    deleteMessage
  };
}