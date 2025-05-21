import React, { useState } from 'react';
import ListFoldersModal from './ListFoldersModal';

const CreateButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    const menu = document.querySelector('[role="menu"][data-radix-menu-content]');
    if (menu) {
      menu.remove();
    }

    setShowModal(true);
  };

  return (
    <div
      className="hover:bg-gray-200 can-hover:cursor-pointer rounded-10 w-full flex items-center space-x-2 py-1"
      role="menuitem"
      onClick={handleClick}
    >
      <div className="flex space-y-2 items-center justify-center h-4 w-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>
      </div>
      <span className="text-sm">Añadir carpeta</span>

      {showModal && <ListFoldersModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CreateButton;


