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

const defaultCourtSetup: CourtSetup = { ratePerHour: 170, entries: [] };

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

export const DEFAULT_PLAYERS = ['Jed', 'Juk', 'Aoh', 'Buo', 'Mao', 'Joy', 'Heng', 'Benz'];

function defaultAppData(): AppData {
  return {
    shuttlecockPrice: 0,
    courtSetup: defaultCourtSetup,
    players: [...DEFAULT_PLAYERS],
    games: [],
    paidPlayers: [],
  };
}

function storageKeyForDate(date: string): string {
  return `${STORAGE_KEY}-${date}`;
}

function readFromLocalStorage(date: string): AppData {
  if (typeof window === 'undefined') return defaultAppData();
  const stored = localStorage.getItem(storageKeyForDate(date));
  if (!stored) return defaultAppData();
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    return normalizeParsed(parsed);
  } catch {
    return defaultAppData();
  }
}

function writeToLocalStorage(data: AppData, date: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKeyForDate(date), JSON.stringify(data));
}

/** Load app data for a given date (YYYY-MM-DD). Uses Supabase if configured, otherwise localStorage. */
export async function getStoredData(date: string): Promise<AppData> {
  if (typeof window === 'undefined') {
    return defaultAppData();
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('app_data')
        .select('data')
        .eq('id', date)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getStoredData error:', error);
        return readFromLocalStorage(date);
      }
      if (data?.data) {
        return normalizeParsed(data.data as Record<string, unknown>);
      }
    }
  }

  return readFromLocalStorage(date);
}

/** Save app data for a given date (YYYY-MM-DD). Uses Supabase if configured, otherwise localStorage. */
export async function saveData(data: AppData, date: string): Promise<void> {
  if (typeof window === 'undefined') return;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('app_data').upsert(
        {
          id: date,
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

  writeToLocalStorage(data, date);
}

/** Subscribe to realtime changes for a given date. Returns an unsubscribe function. */
export function subscribeToDate(
  date: string,
  onUpdate: (data: AppData) => void
): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`app_data:${date}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'app_data',
        filter: `id=eq.${date}`,
      },
      (payload) => {
        const row = payload.new as { data?: Record<string, unknown> } | undefined;
        if (row?.data) {
          onUpdate(normalizeParsed(row.data));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
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
