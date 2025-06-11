import React, { useState } from 'react';
import { getTranslator } from './i18n.jsx';

export default function AuthPanel() {
    const [showModal, setShowModal] = useState(false);
    const [authMode, setAuthMode] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const API_URL = 'https://gpt-organizer-backend.onrender.com/auth';

    let t = getTranslator();

    const openModal = (mode) => {
        setAuthMode(mode);
        setShowModal(true);
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async () => {
        const endpoint = authMode === 'login' ? 'login' : 'register';

        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error('Error en la autenticación');
            const data = await res.json();

            console.log('Respuesta:', data);
            window.location.reload();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert('Error al autenticar');
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h6 className="__menu-label">{t.sidebar_extension_name}</h6>
            <div className="w-full center text-center">
                <div
                    className="group __menu-item gap-2 data-fill:gap-2 justify-between btn btn-primary"
                    onClick={() => openModal('login')}
                >
                    <span className="text-sm truncate">{t.auth.login}</span>
                </div>
                <div
                    className="group __menu-item gap-2 data-fill:gap-2 justify-between btn btn-primary mt-2"
                    onClick={() => openModal('register')}
                >
                    <span className="text-sm truncate">{t.auth.register}</span>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80">
                    <div className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]">
                        <div className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]">
                            <h2 className="text-lg font-semibold mb-4">
                                {authMode === 'login' ? t.auth.login : t.auth.register}
                            </h2>

                            <input
                                type="email"
                                placeholder={t.auth.email_placeholder}
                                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder={t.auth.password_placeholder}
                                className="mt-4 bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    className="btn relative btn-secondary mt-4"
                                    onClick={() => setShowModal(false)}
                                >
                                    {t.auth.btn_cancel}
                                </button>
                                <button
                                    className="btn relative btn-primary mt-4"
                                    onClick={handleSubmit}
                                >
                                    {authMode === 'login' ? t.auth.btn_login : t.auth.btn_register}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}
