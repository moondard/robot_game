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
                    activeBlockId: cmd.id,
                    log: `Шаг вперёд → (${state.x}, ${state.y})`,
                });
                return true;
            }

            case 'turn': {
                state = { ...state, direction: rotate(state.direction, cmd.direction) };
                steps.push({
                    state: { ...state },
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
                        activeBlockId: cmd.id,
                        log: `Монета собрана! Всего: ${state.coins}`,
                    });
                } else {
                    steps.push({
                        state: { ...state },
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
Проверка, выполнена ли цель уровня после программы.
Возвращает { success, stars }.
*/
export function checkGoal(
    level: ILevel,
    finalState: IRobotState,
    programLength: number
): { success: boolean; stars: number } {
    const cell = level.grid[finalState.y]?.[finalState.x];
    const atExit = cell === 'exit';
    const allCoins = level.goal.allCoinsCollected
        ? finalState.coins >= countCoins(level.grid)
        : true;
    const atExitGoal = level.goal.robotAtExit ? atExit : true;

    const success = atExitGoal && allCoins;

    // Звёзды: 3 — уложился в maxCommands (если задан), иначе 2 или 1
    let stars = 0;
    if (success) {
        if (level.goal.maxCommands && programLength <= level.goal.maxCommands) {
            stars = 3;
        } else if (programLength <= 5) {
            stars = 2;
        } else {
            stars = 1;
        }
    }

    return { success, stars };
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