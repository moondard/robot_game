import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import type { CellType, Command, IRobotState } from '../../interfaces/Level';

import { LEVELS } from '../../data/Levels';

import { execute, checkGoal } from '../../services/interpreter';

import { useProgressStoreActions } from '../../store/Progress/useProgressStore';

import { Board } from '../../components/Board/indes';
import { ProgramPanel } from '../../components/ProgramPanel';
import { CommandPalette } from '../../components/CommandPalette';

import './styles.scss';

// Уникальный id для команды
let cmdCounter = 0;
function nextId() {
    cmdCounter += 1;
    return `cmd-${cmdCounter}`;
}

/*
Экран игры: поле, робот, панель программы.
Drag&drop команд, запуск интерпретатора, проверка цели.
*/
export function Game() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const levelId = Number(id);
    const level = LEVELS.find((l) => l.id === levelId);

    const { completeLevel, addCoins } = useProgressStoreActions();

    // Программа игрока (список команд)
    const [program, setProgram] = useState<Command[]>([]);
    // Текущее состояние робота (для отрисовки)
    const [robotState, setRobotState] = useState<IRobotState | null>(null);
    const [currentGrid, setCurrentGrid] = useState<CellType[][] | null>(null);
    // Активный блок (подсветка)
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    // Лог выполнения
    const [log, setLog] = useState('');
    // Флаг: программа выполняется
    const [isRunning, setIsRunning] = useState(false);
    // Результат: победа/поражение
    const [result, setResult] = useState<'win' | 'fail' | null>(null);

    // DnD-сенсор (мышь + тач)
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    }));

    if (!level) {
        return (
            <div className="game game--error">
                <p>Уровень не найден</p>
                <button onClick={() => navigate('/map')}>← К карте</button>
            </div>
        );
    }

    // Стартовое состояние робота
    const initialRobot: IRobotState = robotState ?? level.start;

    // Drag&drop: блок из палитры → в программу
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || over.id !== 'program-drop') return;

        const commandType = active.data.current?.commandType as string | undefined;
        if (!commandType) return;

        // Создаём команду
        let newCmd: Command;
        switch (commandType) {
            case 'move':
                newCmd = { type: 'move', id: nextId() };
                break;
            case 'turn-left':
                newCmd = { type: 'turn', direction: 'left', id: nextId() };
                break;
            case 'turn-right':
                newCmd = { type: 'turn', direction: 'right', id: nextId() };
                break;
            case 'pick':
                newCmd = { type: 'pick', id: nextId() };
                break;
            case 'repeat':
                newCmd = { type: 'repeat', times: 2, body: [], id: nextId() };
                break;
            case 'if':
                newCmd = { type: 'if', condition: 'wallAhead', then: [], id: nextId() };
                break;
            default:
                return;
        }

        setProgram((prev) => [...prev, newCmd]);
    };

    // Удалить команду из программы
    const removeCommand = (cmdId: string) => {
        setProgram((prev) => prev.filter((c) => c.id !== cmdId));
    };

    // Запуск программы
    const handleRun = async () => {
        if (isRunning || program.length === 0) return;
        setCurrentGrid(null);
        setIsRunning(true);
        setResult(null);
        setLog('');


        const steps = execute(program, level);

        // Проигрываем шаги с задержкой
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            setRobotState(step.state);
            setCurrentGrid(step.grid);
            setActiveBlockId(step.activeBlockId);
            setLog(step.log);

            if (step.error) {
                setResult('fail');
                setIsRunning(false);
                return;
            }

            await new Promise((r) => setTimeout(r, 500));
        }

        // Проверяем цель
        const finalState = steps[steps.length - 1]?.state ?? level.start;
        const { success, stars } = checkGoal(level, finalState, program.length);

        if (success) {
            setResult('win');
            completeLevel(level.id, stars);
            addCoins(stars * 10);
        } else {
            setResult('fail');
        }

        setIsRunning(false);
        setActiveBlockId(null);
    };

    // Сброс
    const handleReset = () => {
        setProgram([]);
        setCurrentGrid(null);
        setRobotState(null);
        setActiveBlockId(null);
        setLog('');
        setResult(null);
        setIsRunning(false);
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="game">
                <header className="game__header">
                    <button className="game__back" onClick={() => navigate('/map')}>
                        ← К карте
                    </button>
                    <h1 className="game__title">{level.name}</h1>
                    <div className="game__id">Уровень {level.id}</div>
                </header>

                <div className="game__content">
                    <div className="game__left">
                        <Board
                            grid={currentGrid ?? level.grid}
                            robot={initialRobot}
                            activeBlockId={activeBlockId}
                        />
                        {log && <div className="game__log">{log}</div>}
                    </div>

                    <div className="game__right">
                        <ProgramPanel
                            program={program}
                            activeBlockId={activeBlockId}
                            isRunning={isRunning}
                            onRemove={removeCommand}
                        />
                        <CommandPalette allowed={level.allowedCommands} />
                        <div className="game__actions">
                            <button
                                className="game__run"
                                onClick={handleRun}
                                disabled={isRunning || program.length === 0 || result !== null}
                            >
                                ▶ Запустить
                            </button>
                            <button className="game__reset" onClick={handleReset} disabled={isRunning}>
                                ↺ Сброс
                            </button>
                        </div>
                        {result === 'win' && <div className="game__result game__result--win">Победа! ⭐</div>}
                        {result === 'fail' && <div className="game__result game__result--fail">Не получилось</div>}
                    </div>
                </div>
            </div>
        </DndContext>
    );
}