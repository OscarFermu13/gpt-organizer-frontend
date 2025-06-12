import React from 'react';
import { getTranslator } from '../../../lib/i18n.jsx';

const t = getTranslator();

export default function ContextMenu({ data, onClose, setModalState }) {
    if (!data) return null;

    const { type, data: item, x, y } = data;

    const openModal = (key, value) => {
        setModalState((prev) => ({ ...prev, [key]: value }));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-40" onClick={onClose} role="dialog">
            <div
                className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5"
                //style={{ top: y + 4, left: x }}
                onClick={(e) => e.stopPropagation()}
            >
                {type === 'folder' && (
                    <div
                        className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
                        style={{ top: data.y + 4, left: data.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('renameFolder', item)}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                            <span>{t.context_menu.folder.rename}</span>
                        </div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('moveFolder', item)}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                </svg>
                            </div>
                            <span>{t.context_menu.folder.move}</span>
                        </div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('addSubfolder', item.id)}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                </svg>
                            </div>
                            <span>{t.context_menu.folder.add_subfolder}</span>
                        </div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('changeColor', item)}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                </svg>
                            </div>
                            <span>{t.context_menu.folder.change_color}</span>
                        </div>

                        <div className='h-px bg-gray-700 my-1 mx-4'></div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            data-color="danger"
                            onClick={() => {
                                setModalState((prev) => ({
                                    ...prev,
                                    confirmDelete: { type, item },
                                }));
                                onClose();
                            }}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                            <span>{t.context_menu.folder.delete}</span>
                        </div>
                    </div>
                )}

                {type === 'chat' && (
                    <div
                        className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
                        style={{ top: y + 4, left: x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('renameChat', item)}
                        >
                            <div className="flex items-center justify-center h-4 w-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                            <span>{t.context_menu.chat.rename}</span>
                        </div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            onClick={() => openModal('moveChat', item)}
                        >
                            <div className="flex items-center justify-center h-4 w-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                </svg>
                            </div>
                            <span>{t.context_menu.chat.move}</span>
                        </div>

                        <div className='h-px bg-gray-700 my-1 mx-4'></div>

                        <div
                            className="group __menu-item pe-8 gap-1.5"
                            data-color="danger"
                            onClick={() => {
                                setModalState((prev) => ({
                                    ...prev,
                                    confirmDelete: { type, item },
                                }));
                                onClose();
                            }}
                        >
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                            <span>{t.context_menu.chat.delete}</span>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
