// components/FolderList/FolderList.jsx
import React, { useEffect, useState } from 'react';
import { useFolders } from './hooks/useFolders';
import FolderTree from './folderTree';
import ContextMenu from './menus/contextMenu';
import CogMenu from './menus/cogMenu';
import NotificationProvider  from '../../components/notificationProvider';

import CreateFolderModal from './modals/createFolderModal';
import RenameFolderModal from './modals/renameFolderModal';
import MoveFolderModal from './modals/moveFolderModal';
import RenameChatModal from './modals/renameChatModal';
import MoveChatModal from './modals/moveChatModal';
import AddSubfolderModal from './modals/addSubfolderModal';
import ChangeColorModal from './modals/changeColorModal';
import ConfirmDeleteModal from './modals/confirmDeleteModal';
import ChangeLanguageModal from './modals/changeLanguageModal';

import { getTranslator } from '../../lib/i18n.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com';
const WEB_URL = 'http://localhost:3000/dashboard';


export default function FolderList() {
  const {
    folders,
    loading,
    expandedFolders,
    toggleFolder,
    fetchFolders,
    setFolders
  } = useFolders();

  const [contextMenu, setContextMenu] = useState(null);
  const [cogMenuPos, setCogMenuPos] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [modalState, setModalState] = useState({
    renameFolder: null,
    moveFolder: null,
    renameChat: null,
    moveChat: null,
    addSubfolder: null,
    changeColor: null,
    confirmDelete: null,
    changeLang: false
  });

  const openContextMenu = (e, type, data) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({ x: rect.right, y: rect.top, type, data });
  };

  const openCogMenu = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setCogMenuPos({ x: rect.right, y: rect.top });
  };

  const closeContextMenu = () => setContextMenu(null);
  const closeCogMenu = () => setCogMenuPos(null);

  const t = getTranslator();

  if (loading) return <div className="m-4 text-white text-sm">{t.sidebar_loading_message}</div>;

  return (
    <div className="mt-(--sidebar-section-margin-top)">

      <NotificationProvider />

      {/* Header */}
      <div className="justify-between flex items-center gap-2 truncate">
        <h6 className="__menu-label">{t.sidebar_header}</h6>
        <button onClick={openCogMenu} className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      {/* Folder Tree */}
      <FolderTree
        folders={folders}
        expanded={expandedFolders}
        toggleFolder={toggleFolder}
        openContextMenu={openContextMenu}
      />

      {/* Botón crear carpeta */}
      <div
        onClick={() => setShowCreateModal(true)}
        className='mt-2 group __menu-item gap-2 data-fill:gap-2 bg-white text-black hover:bg-gray-200'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="text-sm">{t.sidebar_create_folder_btn}</span>
      </div>

      {/* Menús */}
      {cogMenuPos && (
        <CogMenu
          onClose={closeCogMenu}
          logout={() => {
            fetch(`${API_URL}/auth/logout`, {
              method: 'POST', credentials: 'include'
            }).then(() => window.location.reload());
          }}
          setShowLanguageModal={() => setModalState(s => ({ ...s, changeLang: true }))}
          adminAccount={() => {
            window.open(WEB_URL, '_blank');
            closeCogMenu();
          }}
          position={cogMenuPos}
        />
      )}

      {contextMenu && (
        <ContextMenu
          data={contextMenu}
          onClose={closeContextMenu}
          setModalState={setModalState}
        />
      )}

      {/* Modales */}
      {showCreateModal && (
        <CreateFolderModal
          onClose={() => setShowCreateModal(false)}
          folders={folders}
          setFolders={setFolders}
        />
      )}

      {modalState.renameFolder && (
        <RenameFolderModal
          folder={modalState.renameFolder}
          onClose={() => setModalState(s => ({ ...s, renameFolder: null }))}
          setFolders={setFolders}
        />
      )}

      {modalState.moveFolder && (
        <MoveFolderModal
          folder={modalState.moveFolder}
          folders={folders}
          onClose={() => setModalState(s => ({ ...s, moveFolder: null }))}
        />
      )}

      {modalState.renameChat && (
        <RenameChatModal
          chat={modalState.renameChat}
          onClose={() => setModalState(s => ({ ...s, renameChat: null }))}
        />
      )}

      {modalState.moveChat && (
        <MoveChatModal
          chat={modalState.moveChat}
          folders={folders}
          onClose={() => setModalState(s => ({ ...s, moveChat: null }))}
        />
      )}

      {modalState.addSubfolder && (
        <AddSubfolderModal
          parentId={modalState.addSubfolder}
          onClose={() => setModalState(s => ({ ...s, addSubfolder: null }))}
          setFolders={setFolders}
        />
      )}

      {modalState.changeColor && (
        <ChangeColorModal
          folderId={modalState.changeColor.id}
          currentColor={modalState.changeColor.color}
          onClose={() => setModalState(s => ({ ...s, changeColor: null }))}
        />
      )}

      {modalState.confirmDelete && (
        <ConfirmDeleteModal
          item={modalState.confirmDelete.item}
          type={modalState.confirmDelete.type}
          onClose={() => setModalState((s) => ({ ...s, confirmDelete: null }))}
        />
      )}

      {modalState.changeLang && (
        <ChangeLanguageModal
          onClose={() => setModalState(s => ({ ...s, changeLang: false }))}
        />
      )}

    </div>
  );
}
