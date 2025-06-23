import React from 'react';

export default function ChatItem({ chat, depth, openContextMenu }) {
  return (
    <a
      className="group __menu-item gap-6 justify-between flex items-center"
      style={{ marginLeft: `${depth * 16}px` }}
      href={`https://chatgpt.com/${chat.chatId}`}
    >
      <div class="flex min-w-0 grow items-center gap-2">
        <div class="truncate grow">
          <span>{chat.title}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e, 'chat', chat);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4" strokeWidth={2} aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path>
        </svg>
      </button>
    </a>
  );
}
