import React, { useEffect, useState } from 'react';

export default function FolderList() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#888888');

  const API_URL = 'http://localhost:4000/folders';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWJjMDR3MnAwMDAwMXlrcDEyNzJsYWlrIiwiaWF0IjoxNzQ4NjgyMTkxLCJleHAiOjE3NDkyODY5OTF9.JHrZvsvQuZEv-gjWNdFrEHwnmZXqNf2KaggYm8FQmvo';

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

    const handleUpdate = () => {
      fetchFolders();
    };

    window.addEventListener('folderUpdated', handleUpdate);
    return () => window.removeEventListener('folderUpdated', handleUpdate);
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

  const buildFolderTree = (folders) => {
    const folderMap = new Map();
    const roots = [];

    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    folders.forEach(folder => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId).children.push(folderMap.get(folder.id));
      } else {
        roots.push(folderMap.get(folder.id));
      }
    });

    return roots;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderFolder = (folder, depth = 0) => {
    return (
      <div key={folder.id}>
        <div
          className="group __menu-item gap-2 data-fill:gap-2"
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#FFFFFF' }}></span>
          <span className="text-sm">{folder.name}</span>
        </div>

        {folder.chats?.map(chat => (
          <div
            key={chat.id}
            className="group __menu-item gap-6 data-fill:gap-2"
            style={{ paddingLeft: `${(depth + 1) * 16}px` }}
          >
            <a href={"https://chatgpt.com/c/" + chat.chatId}>{chat.title}</a>
          </div>
        ))}

        {folder.children?.map(child => renderFolder(child, depth + 1))}
      </div>
    );
  };

  if (loading) return <div className="text-white text-sm">Cargando carpetas...</div>;

  const folderTree = buildFolderTree(folders);

  return (
    <div className="mt-4">
      <h6 className="__menu-label">Carpetas</h6>
      <ul className="space-y-2">

        {folderTree.map(folder => renderFolder(folder))}

        <li
          onClick={() => setShowModal(true)}
          className='group __menu-item gap-2 data-fill:gap-2'
        //className="hover:bg-gray-300 flex items-center space-x-2 cursor-pointer rounded p-2"
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }}></span>
          <span className="text-sm">Crear carpeta</span>
        </li>
      </ul>

      {/* Modal */}
      {showModal && (
        <div
          //className='popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]'  
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80"
          onClick={() => setShowModal(false)}>
          <div
            className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="pb-4 text-lg font-bold">Nueva carpeta</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nombre de la carpeta"
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
              />

              <div className="pt-4 flex items-center space-x-3">
                <label className="text-muted text-token-text-primary py-2 text-sm font-medium">Color:</label>
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-8 h-8 border-token-border-medium flex items-center justify-between gap-2 rounded-sm border whitespace-nowrap"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn relative btn-secondary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3"
                >
                  Cancelar
                </button>
                <button
                  onClick={createFolder}
                  className="btn relative btn-primary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3"
                >
                  Crear carpeta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}