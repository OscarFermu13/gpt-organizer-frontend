import React from 'react';
import ChatItem from './chatItem';

export default function FolderItem({ folder, depth, expanded, toggleFolder, openContextMenu }) {
  const isExpanded = expanded[folder.id];
  const hasChildren = folder.chats?.length > 0 || folder.children?.length > 0;

  return (
    <div key={folder.id} className="relative">
      {isExpanded && hasChildren && (
        <div
          className="absolute top-8 bottom-2 w-px bg-gray-600"
          style={{ left: `calc(${(depth + 1) * 16}px + 0.3rem)` }}
        />
      )}

      <div
        className="group __menu-item gap-2 justify-between"
        style={{ marginLeft: `${depth * 16}px` }}
        onClick={() => toggleFolder(folder.id)}
      >
        <div className="pl-2 flex items-center gap-2 truncate">
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ fill: folder.color || '#FFFFFF' }}>
            <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
          </svg>
          <div className="truncate flex items-center gap-1">
            <span className="text-sm truncate">{folder.name}</span>
            {!isExpanded && hasChildren && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <button
          onClick={(e) => openContextMenu(e, 'folder', folder)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4" strokeWidth={2} aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path>
          </svg>
        </button>
      </div>

      {isExpanded && (
        <>
          {folder.chats?.map(chat => (
            <ChatItem key={chat.id} chat={chat} depth={depth + 2} openContextMenu={openContextMenu} />
          ))}
          {folder.children?.map(child => (
            <FolderItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              expanded={expanded}
              toggleFolder={toggleFolder}
              openContextMenu={openContextMenu}
            />
          ))}
        </>
      )}
    </div>
  );
}
