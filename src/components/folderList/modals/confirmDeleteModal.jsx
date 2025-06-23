import React from 'react';
import { getTranslator } from '../../../lib/i18n.jsx';
import { notifyError } from '../../../components/notificationProvider.jsx';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

const t = getTranslator();

export default function ConfirmDeleteModal({ item, type, onClose }) {
    const deleteItem = async () => {
        try {
            await fetch(`${API_URL}/${type === 'chat' ? 'chats' : 'folders'}/${item.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const msg = type === 'chat' ? t.success_messages.chat_deleted : t.success_messages.folder_deleted;

            window.dispatchEvent(new CustomEvent('folderUpdated', {
                detail: { msg: msg }
            }));
            onClose();
        } catch (err) {
            notifyError(t.error_messages.item_deleted);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80"
            onClick={onClose}
        >
            <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
                <div
                    className="gpt-organizer-modal p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]"
                    onClick={e => e.stopPropagation()}
                >
                    <h2 className="text-lg font-bold mb-4">{t.delete_modal.title}{type === 'chat' ? t.delete_modal.chat : t.delete_modal.folder}?</h2>
                    
                    <div className='h-px bg-gray-700 my-1'></div>
                    
                    <p className="my-4">
                        {t.delete_modal.message}<strong>{item.name || item.title}</strong>
                    </p>
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="btn btn-secondary">{t.delete_modal.btn_cancel}</button>
                        <button onClick={deleteItem} className="btn btn-danger">{t.delete_modal.btn_delete}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
