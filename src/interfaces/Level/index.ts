export type LevelType = 'linear' | 'collect' | 'conditions' | 'loops';

export type LevelStatus = 'locked' | 'available' | 'completed';

export type Direction = 'up' | 'right' | 'down' | 'left';

export type CellType = 'empty' | 'wall' | 'coin' | 'exit';

export type Command =
    | { type: 'move'; id: string }
    | { type: 'turn'; direction: 'left' | 'right'; id: string }
    | { type: 'pick'; id: string }
    | { type: 'repeat'; times: number; body: Command[]; id: string }
    | { type: 'if'; condition: 'wallAhead'; then: Command[]; id: string };

export interface ILevelProgress {
    id: number;
    name: string;
    type: LevelType;
    status: LevelStatus;
    stars: number;
}

export interface IRobotState {
    x: number;
    y: number;
    direction: Direction;
    coins: number;
}

export interface ILevel {
    id: number;
    name: string;
    type: LevelType;
    grid: CellType[][];
    start: IRobotState;
    goal: {
        allCoinsCollected?: boolean;
        robotAtExit?: boolean;
        maxCommands?: number;
    };
    allowedCommands: ('move' | 'turn' | 'pick' | 'repeat' | 'if')[];
    hint?: string;
}

export interface IExecutionStep {
    state: IRobotState;
    activeBlockId: string;
    log: string;
    error?: string;
}

