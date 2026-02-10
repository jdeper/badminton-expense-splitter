import { getSupabase, isSupabaseConfigured } from './supabase';

export interface GameData {
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  shuttlecocks: number;
  /** When true, shuttlecock cost for this game is half (re-used shuttlecocks). */
  reusedShuttlecocks?: boolean;
  date: string;
}

export interface CourtSetupEntry {
  courtNumber: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface CourtSetup {
  ratePerHour: number;
  entries: CourtSetupEntry[];
}

export interface AppData {
  shuttlecockPrice: number;
  courtSetup: CourtSetup;
  players: string[];
  games: GameData[];
  /** Player names that have been marked as paid. */
  paidPlayers: string[];
}

const STORAGE_KEY = 'badminton-expense-splitter';
const APP_DATA_ROW_ID = 'default';

const defaultCourtSetup: CourtSetup = { ratePerHour: 0, entries: [] };

function normalizeParsed(parsed: Record<string, unknown>): AppData {
  if (!parsed.courtSetup) {
    parsed.courtSetup = defaultCourtSetup;
  }
  const courtSetup = parsed.courtSetup as CourtSetup;
  const entries = courtSetup.entries || [];
  courtSetup.entries = entries.map((e: CourtSetupEntry & { hours?: number }) => {
    if (e.startHour != null && e.endHour != null) return e;
    const hours = typeof e.hours === 'number' ? e.hours : 0;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return {
      courtNumber: e.courtNumber ?? '',
      startHour: 0,
      startMinute: 0,
      endHour: h,
      endMinute: m,
    };
  });
  delete (parsed as Record<string, unknown>).courtFee;
  if (!Array.isArray(parsed.paidPlayers)) parsed.paidPlayers = [];
  return parsed as unknown as AppData;
}

function defaultAppData(): AppData {
  return {
    shuttlecockPrice: 0,
    courtSetup: defaultCourtSetup,
    players: [],
    games: [],
    paidPlayers: [],
  };
}

function readFromLocalStorage(): AppData {
  if (typeof window === 'undefined') return defaultAppData();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultAppData();
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    return normalizeParsed(parsed);
  } catch {
    return defaultAppData();
  }
}

function writeToLocalStorage(data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Load app data. Uses Supabase if configured, otherwise localStorage. */
export async function getStoredData(): Promise<AppData> {
  if (typeof window === 'undefined') {
    return defaultAppData();
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('app_data')
        .select('data')
        .eq('id', APP_DATA_ROW_ID)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getStoredData error:', error);
        return readFromLocalStorage();
      }
      if (data?.data) {
        return normalizeParsed(data.data as Record<string, unknown>);
      }
    }
  }

  return readFromLocalStorage();
}

/** Save app data. Uses Supabase if configured, otherwise localStorage. */
export async function saveData(data: AppData): Promise<void> {
  if (typeof window === 'undefined') return;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('app_data').upsert(
        {
          id: APP_DATA_ROW_ID,
          data: data as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (error) {
        console.warn('Supabase saveData error:', error);
      } else {
        return;
      }
    }
  }

  writeToLocalStorage(data);
}

function entryHours(entry: CourtSetupEntry): number {
  const startM = entry.startHour * 60 + (entry.startMinute ?? 0);
  const endM = entry.endHour * 60 + (entry.endMinute ?? 0);
  const diff = endM - startM;
  return diff > 0 ? diff / 60 : 0;
}

export const getCourtFeeFromSetup = (courtSetup: CourtSetup): number => {
  const totalHours = courtSetup.entries.reduce((sum, e) => sum + entryHours(e), 0);
  return totalHours * courtSetup.ratePerHour;
};
