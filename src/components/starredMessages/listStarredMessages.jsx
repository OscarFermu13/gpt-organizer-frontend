import { getTranslator } from "../../lib/i18n";

const t = getTranslator();

export default function SavedMessagesDrawer({ isOpen, onClose, savedMessages, onSelect, onDelete }) {
  return (
    <>
      {isOpen && (
        <div
          className={`
        fixed pt-12 right-0 h-full w-80 bg-gray-100 dark:bg-gray-800 border-l border-(--border-light) dark:border-(--border-light)
        z-20 overflow-y-auto transform transition-transform duration-300
      `}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t.save_message_modal.header}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="p-4 space-y-2">
            {savedMessages.length ? (
              savedMessages.map(msg => (
              
                <li 
                  className = "group __menu-item gap-6 justify-between flex items-center"
                  onClick={() => onSelect(msg.messageIndex)}
                >
                  <div class="flex min-w-0 grow items-center gap-2">
                    <div class="truncate grow">
                      <span>{msg.text}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(msg.messageIndex);
                    }}
                    className="text-danger"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </li>
          ))
          ) : (
          <div className="text-sm text-gray-500">{t.save_message_modal.no_messages}</div>
            )}
        </ul>
        </div >
      )
}
    </>
  );
}