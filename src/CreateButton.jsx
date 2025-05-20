import React from 'react';

const CreateButton = () => {
  const handleClick = () => {
    alert('¡Componente React ejecutado!');
  };

  return (
    <div
      className="touch:min-h-10 group relative mx-1.5 my-0 flex can-hover:cursor-pointer items-center rounded-[10px] py-2 px-2.5 text-sm select-none custom-menu-item"
      role="menuitem"
      onClick={handleClick}
    >
      <div className="flex shrink-0 items-center justify-center h-[18px] w-[18px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      Mi acción personalizada con React
    </div>
  );
};

export default CreateButton;
