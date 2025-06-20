import { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from '../../notificationProvider';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(() => {
    try {
      const stored = localStorage.getItem('expandedFolders');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('expandedFolders', JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchFolders = async (msg) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/folders`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setFolders(data);
      notifySuccess(msg);
    } catch (err) {
      notifyError("Failed to fetch folders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
    const handleUpdate = (event) => {
      const msg = event.detail.msg !== null ? event.detail.msg : "Success";
      fetchFolders(msg);
    };
    window.addEventListener('folderUpdated', handleUpdate);
    return () => window.removeEventListener('folderUpdated', handleUpdate);
  }, []);

  return {
    folders,
    loading,
    expandedFolders,
    toggleFolder,
    fetchFolders,
    setFolders,
  };
}
