import React, { useEffect, useState } from 'react';

export default function FolderList() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-white">Cargando carpetas...</div>;

  return (
    <div className="bg-black shadow-md rounded-lg p-4 mt-6">
      <h4 className="text-md font-semibold mb-4">Mis Carpetas</h4>
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li key={folder.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded p-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#FFFFFF'  }}></span>
            <span className="text-sm font-medium">{folder.name}</span>
          </li>
        ))}
      </ul>

      {/* TO DO */}

      {/*
      <p>Añadir carpeta</p>
      <p>Actualizar carpeta</p>
      <p>Eliminar carpeta</p>
      */}
    </div>
  );
}