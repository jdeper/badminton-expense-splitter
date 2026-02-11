/** Distinct colors for players (work on dark background). Same name always gets same color. 32 colors. */
const PALETTE = [
  '#22d3ee', // cyan
  '#a78bfa', // violet
  '#34d399', // emerald
  '#fbbf24', // amber
  '#f472b6', // pink
  '#60a5fa', // blue
  '#fb923c', // orange
  '#4ade80', // green
  '#e879f9', // fuchsia
  '#38bdf8', // sky
  '#c084fc', // purple
  '#2dd4bf', // teal
  '#facc15', // yellow
  '#fb7185', // rose
  '#818cf8', // indigo
  '#a855f7', // purple-5
  '#a3e635', // lime
  '#f97316', // orange-6
  '#06b6d4', // cyan-5
  '#8b5cf6', // violet-5
  '#14b8a6', // teal-5
  '#eab308', // yellow-5
  '#ec4899', // pink-5
  '#3b82f6', // blue-5
  '#10b981', // emerald-5
  '#f59e0b', // amber-5
  '#6366f1', // indigo-5
  '#0ea5e9', // sky-5
  '#84cc16', // lime-5
  '#d946ef', // fuchsia-5
  '#ef4444', // red
  '#22c55e', // green-5
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getPlayerColor(playerName: string): string {
  return PALETTE[hashName(playerName) % PALETTE.length];
}

/** For use as subtle background: color with alpha */
export function getPlayerBgColor(playerName: string, alpha = 0.25): string {
  const hex = getPlayerColor(playerName);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
