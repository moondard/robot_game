import { useNavigate } from 'react-router-dom';
import { getUser, setUser } from '../store/session';

export function MainMenu() {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <h1>Главное меню</h1>
            <p>Пользователь: {user?.email}</p>
            <button onClick={() => navigate('/game/1')} style={{ marginRight: 8 }}>
                Играть
            </button>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
}