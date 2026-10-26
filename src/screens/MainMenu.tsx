import { useNavigate } from 'react-router-dom';
import { getUser, setUser } from '../store/session';

import './MainMenu.scss';

export function MainMenu() {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="main-menu">
            <header className="main-menu__header">
                <div className="main-menu__user">
                    <div className="main-menu__avatar">🤖</div>
                    <span className="main-menu__email">{user?.email}</span>
                </div>
                <button className="main-menu__logout" onClick={handleLogout}>
                    Выйти
                </button>
            </header>

            <main className="main-menu__content">
                <div className="main-menu__robot">🤖</div>
                <h1 className="main-menu__title">Robot Programmer</h1>
                <p className="main-menu__subtitle">
                    Научи робота думать, собирая блоки кода
                </p>

                <nav className="main-menu__nav">
                    <button
                        className="main-menu__btn main-menu__btn--primary"
                        onClick={() => navigate('/map')}
                    >
                        ▶ Играть
                    </button>
                    <button
                        className="main-menu__btn"
                        onClick={() => navigate('/shop')}
                    >
                        🛒 Магазин
                    </button>
                    <button
                        className="main-menu__btn"
                        onClick={() => navigate('/achievements')}
                    >
                        🏆 Достижения
                    </button>
                </nav>
            </main>
        </div>
    );
}