import React, { useEffect, useState } from 'react';

export default function FolderList() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#888888');

  const API_URL = 'http://localhost:4000/folders';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWF2M3Y2NmkwMDAwMXkzYWY1NmtpbDU5IiwiaWF0IjoxNzQ3NjYwMzc4LCJleHAiOjE3NDgyNjUxNzh9.Al6j78lkcJD33r9cZuRTq5tFKsiRH3pTpk9zdnswegk';

  useEffect(() => {
    async function fetchFolders() {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setFolders(data);
      } catch (err) {
        console.error('Error al cargar carpetas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFolders();
  }, []);

  async function createFolder() {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFolderName,
          color: newFolderColor,
        }),
      });

      if (!res.ok) throw new Error('Error al crear carpeta');
      const newFolder = await res.json();

      setFolders([...folders, newFolder]);
      setShowModal(false);
      setNewFolderName('');
      setNewFolderColor('#888888');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <div className="text-white text-sm">Cargando carpetas...</div>;

  return (
    <div className="p-2 mt-6">
      <h6 className="text-xs font-semibold mb-4">Carpetas</h6>
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li key={folder.id} 
            className="hover:bg-gray-200 flex items-center space-x-2 cursor-pointer rounded p-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#FFFFFF' }}></span>
            <span className="text-sm">{folder.name}</span>
          </li>
        ))}
        <li
          onClick={() => setShowModal(true)}
          className="hover:bg-gray-200 flex items-center space-x-2 cursor-pointer rounded p-2"
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }}></span>
          <span className="text-sm">Crear carpeta</span>
        </li>
      </ul>

      {/* Modal */}
      {showModal && (
        <div 
        className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}>
          <div 
            className="bg-gray-800 text-white rounded-lg p-6 w-80 shadow-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Nueva carpeta</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nombre de la carpeta"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <div className="flex items-center space-x-3">
              <label className="text-sm">Color:</label>
              <input
                type="color"
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm px-3 py-1 rounded border border-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={createFolder}
                className="text-sm px-3 py-1 bg-white text-black rounded hover:bg-blue-700"
              >
                Crear carpeta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}