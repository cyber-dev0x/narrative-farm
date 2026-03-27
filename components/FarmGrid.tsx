"use client";

import { useState, useEffect, useCallback } from "react";
import { FarmGrid as FarmGridType, Signal, createSignal, tickSignal, waterSignal, computeStats } from "@/lib/signals";
import { loadGrid, saveGrid } from "@/lib/storage";
import FarmTile from "./FarmTile";
import SignalModal from "./SignalModal";
import StatsBar from "./StatsBar";

const GRID_SIZE = 25;
const TICK_INTERVAL = 3000;

function emptyGrid(): FarmGridType {
  return Array(GRID_SIZE).fill(null);
}

export default function FarmGrid() {
  const [grid, setGrid] = useState<FarmGridType>(emptyGrid);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"plant" | "detail" | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadGrid();
    if (saved && saved.length === GRID_SIZE) {
      setGrid(saved);
    }
  }, []);

  // Save whenever grid changes
  useEffect(() => {
    saveGrid(grid);
  }, [grid]);

  // Tick engine
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prev) => {
        const next = prev.map((tile) =>
          tile ? tickSignal(tile) : null
        );
        return next;
      });
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setModalMode(grid[index] ? "detail" : "plant");
  }, [grid]);

  const handlePlant = useCallback((text: string) => {
    if (selectedIndex === null) return;
    setGrid((prev) => {
      const next = [...prev];
      next[selectedIndex] = createSignal(text);
      return next;
    });
    setModalMode(null);
    setSelectedIndex(null);
  }, [selectedIndex]);

  const handleWater = useCallback(() => {
    if (selectedIndex === null) return;
    setGrid((prev) => {
      const next = [...prev];
      const tile = next[selectedIndex];
      if (tile) next[selectedIndex] = waterSignal(tile);
      return next;
    });
  }, [selectedIndex]);

  const handleUproot = useCallback(() => {
    if (selectedIndex === null) return;
    setGrid((prev) => {
      const next = [...prev];
      next[selectedIndex] = null;
      return next;
    });
    setModalMode(null);
    setSelectedIndex(null);
  }, [selectedIndex]);

  const handleCloseModal = useCallback(() => {
    setModalMode(null);
    setSelectedIndex(null);
  }, []);

  const stats = computeStats(grid);
  const selectedSignal = selectedIndex !== null ? grid[selectedIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
      <StatsBar
        active={stats.active}
        mutations={stats.mutations}
        collapsed={stats.collapsed}
      />

      <div className="grid grid-cols-5 gap-2 w-full">
        {grid.map((signal, i) => (
          <FarmTile
            key={i}
            index={i}
            signal={signal}
            onClick={() => handleTileClick(i)}
          />
        ))}
      </div>

      <p className="font-mono text-[#333] text-xs text-center">
        Click an empty plot to plant a signal. Click an active plot to inspect it.
      </p>

      {modalMode === "plant" && selectedIndex !== null && (
        <SignalModal
          mode="plant"
          onPlant={handlePlant}
          onClose={handleCloseModal}
        />
      )}

      {modalMode === "detail" && selectedIndex !== null && selectedSignal && (
        <SignalModal
          mode="detail"
          signal={selectedSignal as Signal}
          onWater={handleWater}
          onUproot={handleUproot}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
