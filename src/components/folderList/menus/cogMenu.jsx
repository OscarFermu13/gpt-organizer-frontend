import React from 'react';
import { getTranslator } from '../../../lib/i18n.jsx';

export default function CogMenu({ onClose, setShowLanguageModal, logout, adminAccount, position }) {
    const t = getTranslator();

    return (
        <div className="fixed inset-0 z-40" onClick={onClose} role="dialog">
            <div
                className="z-50 absolute max-w-md rounded-2xl bg-white dark:bg-[#353535] shadow-xl py-1.5 overflow-y-auto select-none animate-slideUpAndFade radix-side-bottom:animate-slideUpAndFade will-change-[opacity,transform]"
                style={{ top: position.y + 4, left: position.x }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="group __menu-item pe-8 gap-1.5" onClick={setShowLanguageModal}>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                        </svg>
                    </div>
                    <span>{t.gear_menu.language.title}</span>
                </div>

                <div className="group __menu-item pe-8 gap-1.5" onClick={adminAccount}>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth={1.5} className="size-4">
                            <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                        </svg>
                    </div>
                    <span>{t.gear_menu.adminAccount}</span>
                </div>

                <div className="h-px bg-gray-700 my-1 mx-4"></div>

                <div className="group __menu-item pe-8 gap-1.5" data-color="danger" onClick={logout}>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                    </div>
                    <span>{t.gear_menu.logout}</span>
                </div>
            </div>
        </div>
    );
}
