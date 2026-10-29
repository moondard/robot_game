import type { CellType, IRobotState } from '../../interfaces/Level';

import './styles.scss';

interface IBoardProps {
    grid: CellType[][];
    robot: IRobotState;
    activeBlockId: string | null;
}

// Стрелки направления робота
const DIRECTION_ARROWS: Record<string, string> = {
    up: '⬆️',
    right: '➡️',
    down: '⬇️',
    left: '⬅️',
};

/*
Игровое поле: сетка клеток, робот, монеты, выход.
*/
export function Board({ grid, robot }: IBoardProps) {
    return (
        <div className="board">
            {grid.map((row, y) => (
                <div key={y} className="board__row">
                    {row.map((cell, x) => {
                        const isRobot = robot.x === x && robot.y === y;
                        return (
                            <div key={x} className={`board__cell board__cell--${cell}`}>
                                {isRobot ? (
                                    <div className="board__robot">
                                        🤖
                                        <span className="board__robot-dir">
                                            {DIRECTION_ARROWS[robot.direction]}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {cell === 'exit' && '🚪'}
                                        {cell === 'coin' && '🪙'}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}