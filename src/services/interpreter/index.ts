import type {
    CellType,
    Command,
    Direction,
    IExecutionStep,
    ILevel,
    IRobotState,
} from '../../interfaces/Level';

// Поворот направления на 90°
function rotate(dir: Direction, turn: 'left' | 'right'): Direction {
    const order: Direction[] = ['up', 'right', 'down', 'left'];
    const idx = order.indexOf(dir);
    const next = turn === 'right' ? (idx + 1) % 4 : (idx + 3) % 4;
    return order[next];
}

// Следующая позиция по направлению
function getNext(pos: { x: number; y: number }, dir: Direction) {
    switch (dir) {
        case 'up': return { x: pos.x, y: pos.y - 1 };
        case 'right': return { x: pos.x + 1, y: pos.y };
        case 'down': return { x: pos.x, y: pos.y + 1 };
        case 'left': return { x: pos.x - 1, y: pos.y };
    }
}

// Проверка: стена ли впереди
function isWallAhead(state: IRobotState, grid: CellType[][]): boolean {
    const next = getNext(state, state.direction);
    if (next.y < 0 || next.y >= grid.length) return true;
    if (next.x < 0 || next.x >= grid[0].length) return true;
    return grid[next.y][next.x] === 'wall';
}

/*
Выполнить программу и вернуть массив шагов.
Каждый шаг — новое состояние робота + id активного блока + лог.
Если ошибка (стена) — шаг с error, выполнение прекращается.
*/
export function execute(
    program: Command[],
    level: ILevel
): IExecutionStep[] {
    const steps: IExecutionStep[] = [];
    let state: IRobotState = { ...level.start };
    const grid = level.grid.map((row) => [...row]);

    // Рекурсивное выполнение команды
    function run(cmd: Command): boolean {
        switch (cmd.type) {
            case 'move': {
                if (isWallAhead(state, grid)) {
                    steps.push({
                        state: { ...state },
                        grid: grid.map(row => [...row]),
                        activeBlockId: cmd.id,
                        log: 'Стена! Робот не может пройти',
                        error: 'wall',
                    });
                    return false;
                }
                const next = getNext(state, state.direction);
                state = { ...state, x: next.x, y: next.y };
                steps.push({
                    state: { ...state },
                    grid: grid.map(row => [...row]),
                    activeBlockId: cmd.id,
                    log: `Шаг вперёд → (${state.x}, ${state.y})`,
                });
                return true;
            }

            case 'turn': {
                state = { ...state, direction: rotate(state.direction, cmd.direction) };
                steps.push({
                    state: { ...state },
                    grid: grid.map(row => [...row]),
                    activeBlockId: cmd.id,
                    log: `Поворот ${cmd.direction === 'left' ? 'налево' : 'направо'} → ${state.direction}`,
                });
                return true;
            }

            case 'pick': {
                const cell = grid[state.y][state.x];
                if (cell === 'coin') {
                    state = { ...state, coins: state.coins + 1 };
                    grid[state.y][state.x] = 'empty'; // монета исчезает
                    steps.push({
                        state: { ...state },
                        grid: grid.map(row => [...row]),
                        activeBlockId: cmd.id,
                        log: `Монета собрана! Всего: ${state.coins}`,
                    });
                } else {
                    steps.push({
                        state: { ...state },
                        grid: grid.map(row => [...row]),
                        activeBlockId: cmd.id,
                        log: 'Здесь нет монеты',
                    });
                }
                return true;
            }

            case 'repeat': {
                for (let i = 0; i < cmd.times; i++) {
                    for (const inner of cmd.body) {
                        if (!run(inner)) return false;
                    }
                }
                return true;
            }

            case 'if': {
                const cond = cmd.condition === 'wallAhead' && isWallAhead(state, grid);
                if (cond) {
                    for (const inner of cmd.then) {
                        if (!run(inner)) return false;
                    }
                }
                return true;
            }
        }
    }

    for (const cmd of program) {
        if (!run(cmd)) break;
    }

    return steps;
}

/*
Проверка цели уровня и расчёт звёзд
Победа: робот на выходе
Сбор монет не обязателен для победы — влияет только на звёзды
Звёзды:
    3 - все монеты собраны и длина программы меньше или равна оптимальной;
    2 - одно из условий нарушено;
    1 - оба условия нарушены, но победа есть;
    0 - не победа
*/
export function checkGoal(
    level: ILevel,
    finalState: IRobotState,
    programLength: number
): { success: boolean; stars: number } {
    const cell = level.grid[finalState.y]?.[finalState.x];
    const atExit = cell === 'exit';

    // Дошёл ли до выхода
    const atExitGoal = level.goal.robotAtExit ? atExit : true;
    const success = atExitGoal;

    // Если не победа — 0 звёзд
    if (!success) {
        return { success: false, stars: 0 };
    }

    // Все ли монеты собраны (для уровней без монет — true)
    const allCoins = level.goal.allCoinsCollected
        ? finalState.coins >= countCoins(level.grid)
        : true;

    // Уложился ли в оптимальное число команд
    const optimal = level.goal.maxCommands ?? Infinity;
    const inOptimal = programLength <= optimal;

    // Расчёт звёзд
    let stars = 1;
    if (allCoins && inOptimal) {
        stars = 3;
    } else if (allCoins || inOptimal) {
        stars = 2;
    }

    return { success: true, stars };
}

// Подсчёт монет на исходной сетке (до выполнения)
function countCoins(grid: CellType[][]): number {
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell === 'coin') count++;
        }
    }
    return count;
}