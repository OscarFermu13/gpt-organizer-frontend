import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ListFoldersModal = ({ onClose }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL_FOLDER = 'http://localhost:4000/folders';
    const API_URL_CHAT = 'http://localhost:4000/chats';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWF2M3Y2NmkwMDAwMXkzYWY1NmtpbDU5IiwiaWF0IjoxNzQ3NjYwMzc4LCJleHAiOjE3NDgyNjUxNzh9.Al6j78lkcJD33r9cZuRTq5tFKsiRH3pTpk9zdnswegk';

    useEffect(() => {
        async function fetchFolders() {
            try {
                const res = await fetch(API_URL_FOLDER, {
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
    }, []);

    const handleFolderClick = async (folderId) => {
        try {
            const res = await fetch(API_URL_CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    folderId: folderId,
                    favorite: true,
                    chatId: 'GPT Organizer v2',
                }),
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data = await res.json();
            console.log('Chat añadido a la carpeta correctamente: ', data);
            onClose();
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
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
            onClick={() => onClose()}
        >
            <div
                className="bg-gray-800 text-white rounded-lg p-6 w-80 shadow-lg space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">Carpetas</h2>
                {loading ? (
                    <p className="text-sm text-gray-500">Cargando...</p>
                ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {folders.map(folder => (
                            <li 
                                key={folder.id} 
                                className="p-2 bg-gray-800 rounded hover:bg-gray-200"
                                onClick={() => handleFolderClick(folder.id)}
                            >
                                {folder.name}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={() => onClose()}
                    className="text-sm px-3 py-1 rounded border border-gray-300"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ListFoldersModal;