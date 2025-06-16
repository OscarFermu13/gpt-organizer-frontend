import React, { useState } from 'react';
import { getTranslator } from '../../../lib/i18n.jsx';
import { notifyError } from '../../notificationProvider.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

const t = getTranslator();

export default function RenameFolderModal({ folder, onClose, setFolders }) {
    const [newName, setNewName] = useState(folder.name);

    const renameFolder = async () => {
        try {
            const res = await fetch(`${API_URL}/folders/${folder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newName }),
            });
            if (!res.ok) throw new Error('Error al renombrar la carpeta');
            const updatedFolder = await res.json();
            setFolders(prev => prev.map(f => f.id === folder.id ? updatedFolder : f));
            window.dispatchEvent(new CustomEvent('folderUpdated', {
                detail: { msg: t.success_messages.folder_renamed }
            }));
            onClose();
        } catch (err) {
            notifyError(t.error_messages.folder_renamed);
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
                    onClick={e => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold mb-4">{t.rename_folder_modal.title}</h2>
                    <input
                        type="text"
                        className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            className="btn relative btn-secondary mt-4"
                            onClick={onClose}
                        >
                            {t.rename_folder_modal.btn_cancel}
                        </button>
                        <button
                            className="btn relative btn-primary mt-4"
                            disabled={!newName.trim()}
                            onClick={renameFolder}
                        >
                            {t.rename_folder_modal.btn_save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

