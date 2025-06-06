import React, { useEffect, useState } from 'react';
import { translations } from './translations.jsx';

export default function FolderList() {
  const API_URL_FOLDER = 'http://localhost:4000/folders';
  const API_URL_CHAT = 'http://localhost:4000/chats';
  const API_URL_AUTH = 'http://localhost:4000/auth';
  const API_URL = 'http://localhost:4000';

  const lang = "en";
  var t = translations[lang];

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#888888');
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [renameFolderValue, setRenameFolderValue] = useState('');
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false);
  const [showRenameChatModal, setShowRenameChatModal] = useState(false);
  const [renameChatValue, setRenameChatValue] = useState('');
  const [showMoveChatModal, setShowMoveChatModal] = useState(false);
  const [showAddSubfolderModal, setShowAddSubfolderModal] = useState(false);
  const [addSubfolderName, setAddSubfolderName] = useState('');
  const [addSubfolderColor, setAddSubfolderColor] = useState('');
  const [showChangeFolderColorModal, setShowChangeFolderColorModal] = useState(false);
  const [changeFolderColorValue, setChangeFolderColorValue] = useState('#888888');
  

  const [cogMenuModal, setCogMenuModal] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState(false);

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

  const openCogMenu = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setCogMenuModal({
      x: rect.right,
      y: rect.top,
    });
  };

  const closeCogMenu = () => setCogMenuModal(null);

  async function changeLanguage(language) {
    t = translations[language];
    console.log(t.sidebar_header)
    //window.location.reload();
  }

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
        const res = await fetch(API_URL_FOLDER, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
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
    }

    fetchFolders();

    const handleUpdate = () => {
      fetchFolders();
    };

    window.addEventListener('folderUpdated', handleUpdate);
    return () => window.removeEventListener('folderUpdated', handleUpdate);
  }, []);

  async function logout() {
    try {
      const res = await fetch(`${API_URL_AUTH}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al cerrar sesión');
      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  }

  async function createFolder() {
    try {
      const res = await fetch(API_URL_FOLDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

  async function renameFolder(id, newName) {
    try {
      const res = await fetch(`${API_URL_FOLDER}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error('Error al renombrar la carpeta');
      const updatedFolder = await res.json();

      setFolders(folders.map(f => f.id === id ? updatedFolder : f));
      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
      setShowRenameFolderModal(false)
    } catch (err) {
      console.error(err);
    }
  }

  async function addParentFolder(id, parentId) {
    try {
      if (id === parentId) {
        console.error('No puedes añadir una carpeta como padre de sí misma');
        closeContextMenu();
        setShowMoveFolderModal(false);
        return;
      }

      const res = await fetch(`${API_URL_FOLDER}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ parentId: parentId }),
      });

      if (!res.ok) throw new Error('Error al añadir carpeta padre');

      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
      setShowMoveFolderModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function addSubfolder(parentId, name, color) {
    try {
      const res = await fetch(API_URL_FOLDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: name,
          color: color,
          parentId: parentId,
        }),
      });

      if (!res.ok) throw new Error('Error al crear carpeta');
      const newFolder = await res.json();

      setFolders([...folders, newFolder]);
      setShowAddSubfolderModal(false);
      setAddSubfolderName('');
      setAddSubfolderColor('#888888');
    } catch (err) {
      console.error(err);
    }
  }

  async function changeFolderColor(id, color) {
    try {

      const res = await fetch(`${API_URL_FOLDER}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ color: color }),
      });

      if (!res.ok) throw new Error('Error al cambiar el color de la carpeta');

      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
      setShowChangeFolderColorModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteFolder(id) {
    try {
      const res = await fetch(`${API_URL_FOLDER}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al eliminar la carpeta');

      setFolders(folders.filter(f => f.id !== id));
      closeContextMenu();
    } catch (err) {
      console.error(err);
    }
  }

  async function renameChat(id, newTitle) {
    try {
      const res = await fetch(`${API_URL_CHAT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error('Error al renombrar el chat');

      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
      setShowRenameChatModal(false)
    } catch (err) {
      console.error(err);
    }
  }

  async function moveChat(id, folderId) {
    try {
      const res = await fetch(`${API_URL_CHAT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ folderId: folderId }),
      });

      if (!res.ok) throw new Error('Error al mover el chat a la nueva carpeta');

      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
      setShowMoveChatModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteChat(id) {
    try {
      const res = await fetch(`${API_URL_CHAT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al eliminar el chat');

      window.dispatchEvent(new CustomEvent('folderUpdated'));
      closeContextMenu();
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
        setShowRenameFolderModal(false);
        setShowMoveFolderModal(false);
        setShowRenameChatModal(false);
        setShowMoveChatModal(false);
        setShowAddSubfolderModal(false);
        setShowChangeFolderColorModal(false);
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
          className="group __menu-item gap-2 data-fill:gap-2 justify-between"
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="pl-2 justify-start flex items-center gap-2 truncate">
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ fill: folder.color || '#FFFFFF' }}>
              <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
            </svg>
            <div className="truncate">
              <span className="text-sm truncate">{folder.name}</span>
            </div>
          </div>
          <button
            onClick={(e) => openContextMenu(e, 'folder', folder)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>
                </button>
              </div>
            ))}

            {folder.children?.map(child => renderFolder(child, depth + 1))}
          </>
        )}
      </div>
    );
  };

  if (loading) return <div className="m-2 text-white text-sm">{t.sidebar_loading_message}</div>;

  const folderTree = buildFolderTree(folders);

  return (
    <div className="mt-4">
      <div className="justify-between flex items-center gap-2 truncate">
        <h6 className="__menu-label">{t.sidebar_header}</h6>
        <button
          onClick={(e) => openCogMenu(e)}
          className=""
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      <ul className="space-y-2">

        {folderTree.map(folder => renderFolder(folder))}

        <li
          onClick={() => setShowCreateModal(true)}
          className='group __menu-item gap-2 data-fill:gap-2 bg-white text-black hover:bg-gray-200'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="text-sm">{t.sidebar_create_folder_btn}</span>
        </li>
      </ul>

      {/* Cog menu */}
      {cogMenuModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeCogMenu}
          role="dialog"
        >
          <div
            className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
            style={{ top: cogMenuModal.y + 4, left: cogMenuModal.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="group __menu-item pe-8 gap-1.5"
              onClick={() => {
                setShowChangeLanguageModal(true);
              }}
            >
              <div className="flex items-center justify-center h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <span>{t.gear_menu.language.title}</span>
            </div>

            <div className='h-px bg-gray-700 my-1 mx-4'></div>

            <div
              className="group __menu-item pe-8 gap-1.5"
              data-color="danger"
              onClick={() => logout()}
            >
              <div className="flex items-center justify-center h-4 w-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <span>{t.gear_menu.logout}</span>
            </div>

          </div>
        </div>
      )}

      {showChangeLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.gear_menu.language.title}</h2>
              <input
                type="text"
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                placeholder={renameFolderValue}
                onChange={(e) => setRenameFolderValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowChangeLanguageModal(false)}
                >
                  {t.gear_menu.language.btn_cancel}
                </button>
                <button
                  className="btn relative btn-primary mt-4"
                  onClick={async () => {
                    await changeLanguage("es");
                    setShowChangeLanguageModal(false);
                  }}
                >
                  {t.gear_menu.language.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context (3-dots) menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
          role="dialog"
        >

          {contextMenu.type === 'folder' && (
            <div
              className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
              style={{ top: contextMenu.y + 4, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => {
                  setRenameFolderValue(contextMenu.data.name);
                  setShowRenameFolderModal(true);
                }}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.folder.rename}</span>
              </div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => setShowMoveFolderModal(true)}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.folder.move}</span>
              </div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => {
                  setShowAddSubfolderModal(true);
                }}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.folder.add_subfolder}</span>
              </div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => {
                  setShowChangeFolderColorModal(true);
                }}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.folder.change_color}</span>
              </div>

              <div className='h-px bg-gray-700 my-1 mx-4'></div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                data-color="danger"
                onClick={() => deleteFolder(contextMenu.data.id)}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.folder.delete}</span>
              </div>
            </div>
          )}

          {contextMenu.type === 'chat' && (
            <div
              className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
              style={{ top: contextMenu.y + 4, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => {
                  setRenameChatValue(contextMenu.data.title);
                  setShowRenameChatModal(true);
                }}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.chat.rename}</span>
              </div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                onClick={() => setShowMoveChatModal(true)}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.chat.move}</span>
              </div>

              <div className='h-px bg-gray-700 my-1 mx-4'></div>

              <div
                className="group __menu-item pe-8 gap-1.5"
                data-color="danger"
                onClick={() => deleteChat(contextMenu.data.id)}
              >
                <div className="flex items-center justify-center h-4 w-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <span>{t.context_menu.chat.delete}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create folder modal */}
      {showCreateModal && (
        <div
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

              <h2 className="pb-4 text-lg font-bold">{t.create_folder_modal.title}</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={t.create_folder_modal.name_placeholder}
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
              />

              <div className="pt-4 flex items-center space-x-3">
                <label className="text-muted text-token-text-primary py-2 text-sm font-medium">{t.create_folder_modal.color}</label>
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
                  {t.create_folder_modal.btn_cancel}
                </button>
                <button
                  onClick={createFolder}
                  className="btn relative btn-primary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3"
                >
                  {t.create_folder_modal.btn_create}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenameFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.rename_folder_modal.title}</h2>
              <input
                type="text"
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                placeholder={renameFolderValue}
                onChange={(e) => setRenameFolderValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowRenameFolderModal(false)}
                >
                  {t.rename_folder_modal.btn_cancel}
                </button>
                <button
                  className="btn relative btn-primary mt-4"
                  onClick={async () => {
                    await renameFolder(contextMenu.data.id, renameFolderValue)
                  }}
                >
                  {t.rename_folder_modal.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMoveFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.move_folder_modal.title}</h2>

              <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
                {folders.map(folder => (
                  <li
                    key={folder.id}
                    className="btn relative btn-secondary btn-small text-token-text-secondary py-2 ps-2 pe-3 text-md font-normal"
                    onClick={() => addParentFolder(contextMenu.data.id, folder.id)}
                  >
                    {folder.name}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowMoveFolderModal(false)}
                >
                  {t.move_folder_modal.btn_cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddSubfolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.addSubfolder_folder_modal.title}</h2>

              <input
                type="text"
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                placeholder={t.addSubfolder_folder_modal.name_placeholder}
                onChange={(e) => setAddSubfolderName(e.target.value)}
              />
              <div className="pt-4 flex items-center space-x-3">
                <label className="text-muted text-token-text-primary py-2 text-sm font-medium">{t.addSubfolder_folder_modal.color}</label>
                <input
                  type="color"
                  value={addSubfolderColor}
                  onChange={(e) => setAddSubfolderColor(e.target.value)}
                  className="w-8 h-8 border-token-border-medium flex items-center justify-between gap-2 rounded-sm border whitespace-nowrap"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowAddSubfolderModal(false)}
                >
                  {t.addSubfolder_folder_modal.btn_cancel}
                </button>
                <button
                  className="btn relative btn-primary mt-4"
                  onClick={async () => {
                    await addSubfolder(contextMenu.data.id, addSubfolderName, addSubfolderColor)
                  }}
                >
                  {t.addSubfolder_folder_modal.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChangeFolderColorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.changeColor_folder_modal.title}</h2>
              <div className="pt-4 flex items-center space-x-3">
                <label className="text-muted text-token-text-primary py-2 text-sm font-medium">{t.changeColor_folder_modal.color}</label>
                <input
                  type="color"
                  value={changeFolderColorValue}
                  onChange={(e) => setChangeFolderColorValue(e.target.value)}
                  className="w-8 h-8 border-token-border-medium flex items-center justify-between gap-2 rounded-sm border whitespace-nowrap"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowChangeFolderColorModal(false)}
                >
                  {t.changeColor_folder_modal.btn_cancel}
                </button>
                <button
                  className="btn relative btn-primary mt-4"
                  onClick={async () => {
                    await changeFolderColor(contextMenu.data.id, changeFolderColorValue);
                  }}
                >
                  {t.changeColor_folder_modal.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenameChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.rename_chat_modal.title}</h2>
              <input
                type="text"
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                placeholder={renameChatValue}
                onChange={(e) => setRenameChatValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowRenameChatModal(false)}
                >
                  {t.rename_chat_modal.btn_cancel}
                </button>
                <button
                  className="btn relative btn-primary mt-4"
                  onClick={async () => {
                    await renameChat(contextMenu.data.id, renameChatValue)
                  }}
                >
                  {t.rename_chat_modal.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMoveChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
          <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
            <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
              <h2 className="text-lg font-semibold mb-4">{t.move_chat_modal.title}</h2>

              <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
                {folders.map(folder => (
                  <li
                    key={folder.id}
                    className="btn relative btn-secondary btn-small text-token-text-secondary py-2 ps-2 pe-3 text-md font-normal"
                    onClick={() => moveChat(contextMenu.data.id, folder.id)}
                  >
                    {folder.name}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end gap-2">
                <button
                  className="btn relative btn-secondary mt-4"
                  onClick={() => setShowMoveChatModal(false)}
                >
                  {t.move_chat_modal.btn_cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}