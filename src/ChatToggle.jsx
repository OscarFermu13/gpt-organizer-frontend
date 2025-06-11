import React, { useEffect, useState } from 'react';

export default function ChatToggle() {
    const [hidden, setHidden] = useState(() => {
        return localStorage.getItem('sidebarHidden') === 'true';
    });

    useEffect(() => {
        const aside = document.querySelector('#history aside');
        if (aside) {
            aside.classList.toggle('hidden', hidden);
        }
    }, [hidden]);

    const toggleSidebar = () => {
        const aside = document.querySelector('#history aside');

        if (!aside) return;


        aside.classList.toggle('hidden');
        const newHidden = aside.classList.contains('hidden');
        setHidden(newHidden);
        localStorage.setItem('sidebarHidden', newHidden);
    };

    return (
        <div
            className="mt-(--sidebar-section-margin-top) justify-between flex items-center gap-2 truncate hover:bg-gray-700 rounded cursor-pointer"
            onClick={toggleSidebar}
        >
            <h6 className="__menu-label">Chats</h6>
            <button className="text-gray-400">

                {!hidden && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                )}

                {hidden && (
                    <div className='mx-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                )}

            </button>
        </div>
    );
}