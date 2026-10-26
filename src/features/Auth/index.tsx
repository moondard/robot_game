import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setUser } from '../../services/session';

import './styles.scss';

// Экран авторизации: вход, регистрация
export function Auth() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Обработка отправки формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Заполните все поля');
            return;
        }

        // Заглушка: просто сохраняем в переменную
        setUser({ email, isGuest: false });
        navigate('/menu');
    };

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo__robot">🤖</div>
                    <h1 className="auth-logo__title">Robot Programmer</h1>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tabs__tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Вход
                    </button>
                    <button
                        className={`auth-tabs__tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => { setMode('register'); setError(''); }}
                    >
                        Регистрация
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-form__label">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="auth-form__input"
                        />
                    </label>

                    <label className="auth-form__label">
                        Пароль
                        <div className="auth-form__password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="auth-form__input"
                            />
                            <button
                                type="button"
                                className="auth-form__eye"
                                onClick={() => setShowPassword(v => !v)}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                    </label>

                    {error && <div className="auth-form__error">{error}</div>}

                    <button type="submit" className="auth-form__submit">
                        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
}