import { useNavigate } from 'react-router-dom';

import type { IAchievement } from '../../interfaces/Achievement';

import './styles.scss';

// Заглушка: список достижений до продумывания условий разблокировки
const MOCK_ACHIEVEMENTS: IAchievement[] = [
    { id: '1', name: 'Название', description: 'Описание достижения' },
    { id: '2', name: 'Название', description: 'Описание достижения' },
    { id: '3', name: 'Название', description: 'Описание достижения' },
    { id: '4', name: 'Название', description: 'Описание достижения' },
];

/*
Экран достижений.
Пока статичный список — без логики разблокировки.
*/
export function Achievements() {
    const navigate = useNavigate();

    return (
        <div className="achievements">
            <header className="achievements__header">
                <button className="achievements__back" onClick={() => navigate('/menu')}>
                    ← Назад
                </button>
                <h1 className="achievements__title">Достижения</h1>
                <div className="achievements__counter">0 / {MOCK_ACHIEVEMENTS.length}</div>
            </header>

            <div className="achievements__grid">
                {MOCK_ACHIEVEMENTS.map((item) => (
                    <div key={item.id} className="achievements__card">
                        <div className="achievements__card-icon">🏆</div>
                        <div className="achievements__card-name">{item.name}</div>
                        <div className="achievements__card-description">{item.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}