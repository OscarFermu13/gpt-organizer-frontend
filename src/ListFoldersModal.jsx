import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { translations } from './translations.jsx';

const ListFoldersModal = ({ onClose }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL_FOLDER = 'http://localhost:4000/folders';
    const API_URL_CHAT = 'http://localhost:4000/chats';
    const API_URL = 'http://localhost:4000';

    const lang = "en";
    const t = translations[lang];

    const chatHref = sessionStorage.getItem("lastChatHref");
    const chatId = chatHref?.split("/c/")[1] ?? null;
    const chatTitle = sessionStorage.getItem("lastChatTitle") || "Chat sin título";

    useEffect(() => {
        async function fetchFolders() {
            try {
                const res = await fetch(API_URL_FOLDER, {
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
    }, []);

    const handleFolderClick = async (folderId) => {
        try {
            if (chatId) {
                const res = await fetch(API_URL_CHAT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        folderId: folderId,
                        favorite: true,
                        chatId: chatId,
                        title: chatTitle,
                    }),
                });

                if (!res.ok) throw new Error(`Error: ${res.status}`);

                const data = await res.json();
                console.log('Chat añadido a la carpeta correctamente: ', data);
                window.dispatchEvent(new CustomEvent('folderUpdated'));
                onClose();
            }
        } catch (error) {
            console.error('Error al añadir el chat a la carpeta: ', error);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const modalContent = (
        <div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80"
            onClick={() => onClose()}
        >
            <div
                className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold mb-4">{t.add_to_folder_modal.title}</h2>

                    {loading ? (
                        <p className="text-sm text-gray-500">{t.add_to_folder_modal.loading}</p>
                    ) : (
                        <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
                            {folders.map(folder => (
                                <li
                                    key={folder.id}
                                    className="btn relative btn-secondary btn-small text-token-text-secondary py-2 ps-2 pe-3 text-md font-normal"
                                    onClick={() => handleFolderClick(folder.id)}
                                >
                                    {folder.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        onClick={() => onClose()}
                        className="btn relative btn-secondary mt-4"
                    >
                        {t.add_to_folder_modal.btn_cancel}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ListFoldersModal;