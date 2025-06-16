import React, { useState } from 'react';
import DefaultColorPalette from '../../DefaultColorPalette';
import { getTranslator } from '../../../lib/i18n.jsx';
import { notifyError } from '../../../components/notificationProvider.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

const t = getTranslator();

export default function ChangeColorModal({ folderId, currentColor, onClose }) {
    const [color, setColor] = useState(currentColor || '#888888');

    const changeColor = async () => {
        try {
            const res = await fetch(`${API_URL}/folders/${folderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ color }),
            });

            if (!res.ok) throw new Error('Error al cambiar el color de la carpeta');

            window.dispatchEvent(new CustomEvent('folderUpdated', {
                detail: { msg: t.success_messages.update_folder_color }
            }));
            onClose();
        } catch (err) {
            notifyError(t.error_messages.update_folder_color);
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
                    <h2 className="text-lg font-semibold mb-4">{t.changeColor_folder_modal.title}</h2>

                    <DefaultColorPalette value={color} onChange={setColor} />

                    <div className="flex justify-end gap-2">
                        <button
                            className="btn relative btn-secondary mt-4"
                            onClick={onClose}
                        >
                            {t.changeColor_folder_modal.btn_cancel}
                        </button>
                        <button
                            className="btn relative btn-primary mt-4"
                            onClick={changeColor}
                        >
                            {t.changeColor_folder_modal.btn_save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
