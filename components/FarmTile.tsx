"use client";

import { motion } from "framer-motion";
import { Signal, STAGE_COLORS, STAGE_EMOJI } from "@/lib/signals";

interface FarmTileProps {
  signal: Signal | null;
  index: number;
  onClick: () => void;
}

export default function FarmTile({ signal, index, onClick }: FarmTileProps) {
  if (!signal) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="aspect-square flex flex-col items-center justify-center bg-[#111] border border-[#222] hover:border-[#00ff41]/40 hover:bg-[#141414] transition-all text-[#333] font-pixel text-xs rounded"
      >
        <span className="text-2xl opacity-30">+</span>
        <span className="text-[10px] mt-1 opacity-30">empty</span>
      </motion.button>
    );
  }

  const color = STAGE_COLORS[signal.stage];
  const emoji = STAGE_EMOJI[signal.stage];
  const isCollapsed = signal.stage === "collapsed";
  const isMutant = signal.stage === "mutant";
  const isWatered = signal.ticks < signal.wateredUntil;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`aspect-square flex flex-col items-center justify-center p-2 rounded transition-all relative overflow-hidden
        ${isMutant ? "glitch-tile" : ""}
        ${isCollapsed ? "opacity-60" : ""}
      `}
      style={{
        background: "#111",
        border: `1px solid ${color}55`,
        boxShadow: isCollapsed ? "none" : `0 0 8px ${color}44, inset 0 0 6px ${color}11`,
      }}
    >
      {isWatered && !isCollapsed && (
        <span className="absolute top-1 right-1 text-[10px] animate-pulse">💧</span>
      )}
      <span className="text-xl md:text-2xl">{emoji}</span>
      <span
        className="font-pixel text-[8px] md:text-[9px] mt-1 text-center leading-tight line-clamp-2 w-full px-1"
        style={{ color }}
      >
        {signal.currentText.slice(0, 40)}
        {signal.currentText.length > 40 ? "…" : ""}
      </span>
      <span className="font-mono text-[9px] mt-1 opacity-50" style={{ color }}>
        t:{signal.ticks}
      </span>
    </motion.button>
  );
}
