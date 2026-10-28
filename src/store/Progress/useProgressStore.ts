import { create } from 'zustand';

import type { ILevelProgress, LevelType } from '../../interfaces/Level';
import type { IProgressStore } from './interface';

const TYPE_NAMES: Record<LevelType, string> = {
    linear: 'Линейный алгоритм',
    collect: 'Сбор предметов',
    conditions: 'Условия',
    loops: 'Циклы',
};

/*
Генерация 25 уровней: 5 глав по 5 уровней.
Уровень 1 доступен, остальные заблокированы.
*/
function createInitialLevels(): ILevelProgress[] {
    const types: LevelType[] = ['linear', 'collect', 'conditions', 'loops', 'linear'];
    const levels: ILevelProgress[] = [];
    let id = 1;

    for (const type of types) {
        for (let i = 1; i <= 5; i++) {
            levels.push({
                id,
                name: `${TYPE_NAMES[type]} ${i}`,
                type,
                status: id === 1 ? 'available' : 'locked',
                stars: 0,
            });
            id++;
        }
    }

    return levels;
}

// Zustand-стор прогресса: уровни, монеты, действия
export const useProgressStore = create<IProgressStore>((set, get) => ({
    levels: createInitialLevels(),
    coins: 0,

    actions: {
        // Отметить уровень пройденным, сохранить звёзды и открыть следующий
        completeLevel: (id, stars) => {
            const { levels } = get();
            const updatedLevels = levels.map((lvl) => {
                if (lvl.id === id) {
                    return {
                        ...lvl,
                        status: 'completed' as const,
                        stars: Math.max(lvl.stars, stars),
                    };
                }
                // Открываем следующий уровень, если он был заблокирован
                if (lvl.id === id + 1 && lvl.status === 'locked') {
                    return { ...lvl, status: 'available' as const };
                }
                return lvl;
            });

            set({ levels: updatedLevels });
        },

        // Начислить монеты (за прохождение уровня)
        addCoins: (amount) => {
            const { coins } = get();
            set({ coins: coins + amount });
        },
    },
}));

// Хук только для действий — оптимизация: не перерендеривает при изменении данных
export const useProgressStoreActions = () =>
    useProgressStore((state) => state.actions);