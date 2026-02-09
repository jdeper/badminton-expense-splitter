export interface GameData {
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  shuttlecocks: number;
  date: string;
}

export interface AppData {
  shuttlecockPrice: number;
  courtFee: number;
  players: string[];
  games: GameData[];
}

const STORAGE_KEY = 'badminton-expense-splitter';

export const getStoredData = (): AppData => {
  if (typeof window === 'undefined') {
    return {
      shuttlecockPrice: 0,
      courtFee: 0,
      players: [],
      games: [],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {
        shuttlecockPrice: 0,
        courtFee: 0,
        players: [],
        games: [],
      };
    }
  }

  return {
    shuttlecockPrice: 0,
    courtFee: 0,
    players: [],
    games: [],
  };
};

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
