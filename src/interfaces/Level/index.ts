export type LevelType = 'linear' | 'collect' | 'conditions' | 'loops';

export type LevelStatus = 'locked' | 'available' | 'completed';

export interface ILevelProgress {
    id: number;
    name: string;
    type: LevelType;
    status: LevelStatus;
    stars: number;
}