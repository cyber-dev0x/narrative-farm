import { FarmGrid } from "./signals";

const KEY = "narrative-farm-grid";

export function saveGrid(grid: FarmGrid): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(grid));
  } catch {
    // storage full or unavailable
  }
}

export function loadGrid(): FarmGrid | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FarmGrid;
  } catch {
    return null;
  }
}

export function clearGrid(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
