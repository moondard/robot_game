import { useDraggable } from '@dnd-kit/core';

import type { AllowedCommand } from '../../interfaces/Level';

import './styles.scss';

interface ICommandPaletteProps {
    allowed: AllowedCommand[];
}

// Описание блока в палитре
interface IPaletteCommand {
    type: string;             // идентификатор блока (для dnd)
    label: string;            // текст на блоке
    requires: AllowedCommand; // какой тип команды должен быть разрешён
}

// Все доступные команды с иконками
const COMMANDS: IPaletteCommand[] = [
    { type: 'move', label: '➡️ Вперёд', requires: 'move' },
    { type: 'turn-left', label: '🔄 Повернуть налево', requires: 'turn' },
    { type: 'turn-right', label: '🔄 Повернуть направо', requires: 'turn' },
    { type: 'pick', label: '✋ Взять', requires: 'pick' },
    { type: 'repeat', label: '🔁 Повторить', requires: 'repeat' },
    { type: 'if', label: '❓ Если', requires: 'if' },
];

// Один draggable-блок
function DraggableCommand({ type, label }: { type: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { commandType: type },
    });

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;

    return (
        <button
            ref={setNodeRef}
            style={style}
            className={`command-palette__item ${isDragging ? 'command-palette__item--dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            {label}
        </button>
    );
}

/*
Палитра доступных команд. Блоки перетаскиваются в панель программы.
*/
export function CommandPalette({ allowed }: ICommandPaletteProps) {
    const available = COMMANDS.filter((c) => allowed.includes(c.requires));

    return (
        <div className="command-palette">
            <h2 className="command-palette__title">Команды</h2>
            <div className="command-palette__grid">
                {available.map((cmd) => (
                    <DraggableCommand key={cmd.type} type={cmd.type} label={cmd.label} />
                ))}
            </div>
        </div>
    );
}