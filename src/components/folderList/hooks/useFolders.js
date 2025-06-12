import { useState, useEffect } from 'react';

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

  const fetchFolders = async () => {
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
    } catch (err) {
      console.error('Error al cargar carpetas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
    const handleUpdate = () => fetchFolders();
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
