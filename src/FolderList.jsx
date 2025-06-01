import React, { useEffect, useState } from 'react';

export default function FolderList() {
  const API_URL = 'http://localhost:4000/folders';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWJjMDR3MnAwMDAwMXlrcDEyNzJsYWlrIiwiaWF0IjoxNzQ4NjgyMTkxLCJleHAiOjE3NDkyODY5OTF9.JHrZvsvQuZEv-gjWNdFrEHwnmZXqNf2KaggYm8FQmvo';

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#888888');

  const [contextMenu, setContextMenu] = useState(null);

  const openContextMenu = (e, type, data) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: rect.right,
      y: rect.top,
      type,
      data
    });
  };

  const closeContextMenu = () => setContextMenu(null);

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
      setShowCreateModal(false);
      setNewFolderName('');
      setNewFolderColor('#888888');
    } catch (err) {
      console.error(err);
    }
  }

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

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
        setShowCreateModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderFolder = (folder, depth = 0) => {
    const isExpanded = expandedFolders[folder.id];

    return (
      <div key={folder.id}>
        <div
          className="group __menu-item justify-between gap-2 data-fill:gap-2"
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => toggleFolder(folder.id)}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color || '#FFFFFF' }}></span>
          <div className="truncate">
            <span className="text-sm">{folder.name}</span>
          </div>
          <button
            onClick={(e) => openContextMenu(e, 'folder', folder)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M12 16a2 2 0 100 4 2 2 0 000-4zm0-6a2 2 0 100 4 2 2 0 000-4zm0-6a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </button>
        </div>



        {isExpanded && (
          <>
            {folder.chats?.map(chat => (
              <div
                key={chat.id}
                className="group __menu-item gap-6 data-fill:gap-2 justify-between"
                style={{ paddingLeft: `${(depth + 1) * 16}px` }}
              >
                <div className="truncate">
                  <a href={"https://chatgpt.com/c/" + chat.chatId}>{chat.title}</a>
                </div>
                <button
                  onClick={(e) => openContextMenu(e, 'chat', chat)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 16a2 2 0 100 4 2 2 0 000-4zm0-6a2 2 0 100 4 2 2 0 000-4zm0-6a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </button>
              </div>
            ))}

            {folder.children?.map(child => renderFolder(child, depth + 1))}
          </>
        )}
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
          onClick={() => setShowCreateModal(true)}
          className='group __menu-item gap-2 data-fill:gap-2'
        //className="hover:bg-gray-300 flex items-center space-x-2 cursor-pointer rounded p-2"
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }}></span>
          <span className="text-sm">Crear carpeta</span>
        </li>
      </ul>

      {/* Modal */}
      {showCreateModal && (
        <div
          //className='popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]'  
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80"
          onClick={() => setShowCreateModal(false)}>
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
                  onClick={() => setShowCreateModal(false)}
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

      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
          role="dialog"
        >
          <div
            className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
            style={{ top: contextMenu.y + 4, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="group __menu-item pe-8 gap-1.5"
            >
              <div className="flex items-center justify-center h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <span>Cambiar nombre</span>
            </div>

            <div className='h-px bg-gray-700 my-1 mx-4'></div>

            <div
              className="group __menu-item pe-8 gap-1.5"
              data-color="danger"
            >
              <div className="flex items-center justify-center h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <span>Eliminar</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}