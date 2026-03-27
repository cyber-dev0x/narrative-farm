"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Signal, STAGE_COLORS, STAGE_EMOJI } from "@/lib/signals";

interface PlantModalProps {
  mode: "plant";
  onPlant: (text: string) => void;
  onClose: () => void;
}

interface DetailModalProps {
  mode: "detail";
  signal: Signal;
  onWater: () => void;
  onUproot: () => void;
  onClose: () => void;
}

type SignalModalProps = PlantModalProps | DetailModalProps;

export default function SignalModal(props: SignalModalProps) {
  const [text, setText] = useState("");

  const handlePlant = () => {
    if (props.mode !== "plant") return;
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    props.onPlant(trimmed);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) props.onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#0d0d0d] border border-[#00ff41]/50 rounded p-6 w-full max-w-md"
          style={{ boxShadow: "0 0 30px #00ff4133" }}
        >
          {props.mode === "plant" ? (
            <>
              <h2 className="font-pixel text-[#00ff41] text-sm mb-4">Plant a Signal</h2>
              <textarea
                autoFocus
                maxLength={140}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your signal... (max 140 chars)"
                className="w-full bg-[#0a0a0a] border border-[#00ff41]/30 text-[#00ff41] font-mono text-sm p-3 rounded resize-none h-28 focus:outline-none focus:border-[#00ff41] placeholder-[#333]"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="font-mono text-[#444] text-xs">{text.length}/140</span>
                <div className="flex gap-2">
                  <button
                    onClick={props.onClose}
                    className="font-pixel text-xs text-[#555] px-4 py-2 border border-[#333] hover:border-[#555] transition-colors rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlant}
                    disabled={text.trim().length === 0}
                    className="font-pixel text-xs text-[#0a0a0a] bg-[#00ff41] px-4 py-2 rounded hover:bg-[#00cc33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Plant 🌱
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {(() => {
                const s = (props as DetailModalProps).signal;
                const color = STAGE_COLORS[s.stage];
                const emoji = STAGE_EMOJI[s.stage];
                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{emoji}</span>
                      <div>
                        <h2 className="font-pixel text-sm" style={{ color }}>
                          {s.stage.toUpperCase()}
                        </h2>
                        <p className="font-mono text-[#555] text-xs">tick {s.ticks}</p>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#222] rounded p-3 mb-4">
                      <p className="font-mono text-[#aaa] text-sm leading-relaxed">{s.currentText}</p>
                    </div>

                    <div className="mb-4">
                      <p className="font-pixel text-[#ff00ff] text-[10px] mb-2">Mutation history</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {s.mutationHistory.map((m, i) => (
                          <p key={i} className="font-mono text-xs text-[#555] border-l-2 border-[#ff00ff]/30 pl-2">
                            {i === 0 ? <span className="text-[#333]">[original] </span> : null}
                            {m}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={props.onClose}
                        className="font-pixel text-xs text-[#555] px-3 py-2 border border-[#333] hover:border-[#555] transition-colors rounded"
                      >
                        Close
                      </button>
                      {s.stage !== "collapsed" && (
                        <button
                          onClick={(props as DetailModalProps).onWater}
                          className="font-pixel text-xs text-[#0a0a0a] bg-[#00aaff] px-3 py-2 rounded hover:bg-[#0088cc] transition-colors"
                        >
                          💧 Water
                        </button>
                      )}
                      <button
                        onClick={(props as DetailModalProps).onUproot}
                        className="font-pixel text-xs text-[#0a0a0a] bg-[#ff4444] px-3 py-2 rounded hover:bg-[#cc2222] transition-colors"
                      >
                        Uproot
                      </button>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
