import { useDraggable } from '@dnd-kit/core';

import './styles.scss';

interface ICommandPaletteProps {
    allowed: string[];
}

// Все доступные команды с иконками
const COMMANDS = [
    { type: 'move', label: '➡️ Вперёд' },
    { type: 'turn', label: '🔄 Повернуть' },
    { type: 'pick', label: '✋ Взять' },
    { type: 'repeat', label: '🔁 Повторить' },
    { type: 'if', label: '❓ Если' },
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
    const available = COMMANDS.filter((c) => allowed.includes(c.type));

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