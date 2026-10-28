import type { ILevelProgress } from '../../interfaces/Level';

export interface IProgressStore {
    levels: ILevelProgress[];
    coins: number;

    actions: {
        completeLevel: (id: number, stars: number) => void;
        addCoins: (amount: number) => void;
    };
}