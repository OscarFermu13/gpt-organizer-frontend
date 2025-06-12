import React, { useState } from 'react';
import { getTranslator, getLanguage, setLanguage } from '../../../lib/i18n.jsx';

const t = getTranslator();

export default function ChangeLanguageModal({ onClose }) {
    const [lang, setLang] = useState(getLanguage());

    const save = () => {
        setLanguage(lang);
        window.location.reload();
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
                    <h2 className="text-lg font-semibold mb-4">{t.gear_menu.language.title}</h2>

                    <form class="w-full mx-auto">
                        <label for="language" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t.gear_menu.language.title}</label>
                        <select
                            id="language"
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            onClose={onClose}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </form>

                    <div className="flex justify-end gap-2">
                        <button
                            className="btn relative btn-secondary mt-4"
                            onClick={onClose}
                        >
                            {t.gear_menu.language.btn_cancel}
                        </button>
                        <button
                            className="btn relative btn-primary mt-4"
                            onClick={save}
                        >
                            {t.gear_menu.language.btn_save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
