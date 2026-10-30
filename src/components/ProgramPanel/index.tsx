import { useDroppable } from '@dnd-kit/core';

import type { Command } from '../../interfaces/Level';

import './styles.scss';

interface IProgramPanelProps {
    program: Command[];
    activeBlockId: string | null;
    isRunning: boolean;
    onRemove: (id: string) => void;
}

// Названия команд для отображения
const COMMAND_LABELS: Record<string, string> = {
    move: '➡️ Вперёд',
    pick: '✋ Взять',
    repeat: '🔁 Повторить',
    if: '❓ Если',
};

function getCommandLabel(cmd: Command): string {
    if (cmd.type === 'turn') {
        return cmd.direction === 'left' ? '🔄 Повернуть налево' : '🔄 Повернуть направо';
    }
    return COMMAND_LABELS[cmd.type] ?? cmd.type;
}

/*
Панель программы: слоты с командами + зона сброса.
*/
export function ProgramPanel({ program, activeBlockId, isRunning, onRemove }: IProgramPanelProps) {
    const { setNodeRef, isOver } = useDroppable({ id: 'program-drop' });

    return (
        <div className="program-panel">
            <h2 className="program-panel__title">Программа</h2>
            <div
                ref={setNodeRef}
                className={`program-panel__slots ${isOver ? 'program-panel__slots--over' : ''}`}
            >
                {program.length === 0 && (
                    <div className="program-panel__empty">Перетащи блоки сюда</div>
                )}
                {program.map((cmd, idx) => (
                    <div
                        key={cmd.id}
                        className={`program-panel__item ${activeBlockId === cmd.id ? 'program-panel__item--active' : ''}`}
                    >
                        <span className="program-panel__index">{idx + 1}</span>
                        <span className="program-panel__label">
                            {getCommandLabel(cmd)}
                        </span>
                        {!isRunning && (
                            <button
                                className="program-panel__remove"
                                onClick={() => onRemove(cmd.id)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}