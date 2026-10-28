import { useNavigate } from 'react-router-dom';

import type { ILevelProgress } from '../../interfaces/Level';

import './styles.scss';

// Иконки типов уровней
const TYPE_ICONS: Record<string, string> = {
    linear: '➡️',
    collect: '🪙',
    conditions: '❓',
    loops: '🔁',
};

interface ILevelCardProps {
    level: ILevelProgress;
}

/*
Карточка одного уровня на карте.
Три состояния: locked (серая, клик не работает),
available (оранжевая рамка), completed (зелёная + звёзды).
*/
export function LevelCard({ level }: ILevelCardProps) {
    const navigate = useNavigate();
    const isLocked = level.status === 'locked';
    const isCompleted = level.status === 'completed';

    // Клик по доступному или пройденному уровню — переход на экран игры
    const handleClick = () => {
        if (isLocked) return;
        navigate(`/game/${level.id}`);
    };

    return (
        <button
            className={`level-card level-card--${level.status}`}
            onClick={handleClick}
            disabled={isLocked}
        >
            <div className="level-card__number">{level.id}</div>
            <div className="level-card__icon">
                {isLocked ? '🔒' : TYPE_ICONS[level.type]}
            </div>
            <div className="level-card__name">{level.name}</div>

            {/* Звёзды: показываем только для пройденных */}
            {isCompleted && (
                <div className="level-card__stars">
                    {[1, 2, 3].map((star) => (
                        <span
                            key={star}
                            className={`level-card__star ${star <= level.stars ? 'level-card__star--filled' : ''}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            )}
        </button>
    );
}