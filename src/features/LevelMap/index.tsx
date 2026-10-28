import { useNavigate } from 'react-router-dom';

import { useProgressStore } from '../../store/Progress/useProgressStore';

import { LevelCard } from '../../components/LevelCard';

import './styles.scss';

/*
Карта уровней: сетка карточек, счётчик монет, кнопка «Назад».
Уровни открываются последовательно — после прохождения предыдущего.
*/
export function LevelMap() {
    const navigate = useNavigate();
    const levels = useProgressStore((s) => s.levels);
    const coins = useProgressStore((s) => s.coins);

    // Подсчёт пройденных для прогресс-бара
    const completed = levels.filter((l) => l.status === 'completed').length;

    return (
        <div className="level-map">
            <header className="level-map__header">
                <button className="level-map__back" onClick={() => navigate('/menu')}>
                    ← Назад
                </button>
                <h1 className="level-map__title">Карта уровней</h1>
                <div className="level-map__coins">🪙 {coins}</div>
            </header>

            {/* Прогресс: сколько пройдено из 25 */}
            <div className="level-map__progress">
                Пройдено: {completed} / {levels.length}
            </div>

            <div className="level-map__grid">
                {levels.map((level) => (
                    <LevelCard key={level.id} level={level} />
                ))}
            </div>
        </div>
    );
}