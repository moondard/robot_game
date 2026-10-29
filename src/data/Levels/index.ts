import type { ILevel } from '../../interfaces/Level';

/*
Данные уровней.
Пока 3 уровня для отладки — потом расширим до 25.
*/
export const LEVELS: ILevel[] = [
    // Уровень 1: дойти до выхода (2 шага вправо)
    {
        id: 1,
        name: 'Линейный алгоритм 1',
        type: 'linear',
        grid: [
            ['empty', 'empty', 'empty', 'exit'],
        ],
        start: { x: 0, y: 0, direction: 'right', coins: 0 },
        goal: { robotAtExit: true },
        allowedCommands: ['move', 'turn'],
        hint: 'Поверни направо и иди вперёд 3 раза',
    },

    // Уровень 2: собрать монеты и дойти до выхода
    {
        id: 2,
        name: 'Сбор предметов 1',
        type: 'collect',
        grid: [
            ['empty', 'coin', 'empty', 'exit'],
            ['empty', 'wall', 'coin', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
        ],
        start: { x: 0, y: 0, direction: 'right', coins: 0 },
        goal: { allCoinsCollected: true, robotAtExit: true },
        allowedCommands: ['move', 'turn', 'pick'],
        hint: 'Собери все монеты и дойди до выхода',
    },

    // Уровень 3: обойти стену (условие)
    {
        id: 3,
        name: 'Условия 1',
        type: 'conditions',
        grid: [
            ['empty', 'empty', 'wall', 'empty'],
            ['empty', 'wall', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'exit'],
        ],
        start: { x: 0, y: 0, direction: 'right', coins: 0 },
        goal: { robotAtExit: true },
        allowedCommands: ['move', 'turn', 'if'],
        hint: 'Поверни направо, иди вниз, потом налево и вниз',
    },
];