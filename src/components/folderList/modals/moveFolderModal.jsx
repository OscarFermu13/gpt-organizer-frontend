import React from 'react';
import { getTranslator } from '../../../lib/i18n.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

const t = getTranslator();

export default function MoveFolderModal({ folder, folders, onClose }) {
    const moveFolder = async (parentId) => {
        try {
            if (folder.id === parentId) return;
            await fetch(`${API_URL}/folders/${folder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ parentId }),
            });
            window.dispatchEvent(new CustomEvent('folderUpdated'));
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80"
            onClick={onClose}
        >
            <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
                <div
                    className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]"
                    onClick={e => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold mb-4">{t.move_folder_modal.title}</h2>

                    <ul className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
                        {folders.map(folder => (
                            <li
                                key={folder.id}
                                style={{ borderColor: folder.color }}
                                className="btn relative btn-secondary btn-small text-token-text-secondary py-2 ps-2 pe-3 text-md font-normal"
                                onClick={() => moveFolder(folder.id)}
                            >
                                {folder.name}
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-end gap-2">
                        <button
                            className="btn relative btn-secondary mt-4"
                            onClick={onClose}
                        >
                            {t.move_folder_modal.btn_cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



