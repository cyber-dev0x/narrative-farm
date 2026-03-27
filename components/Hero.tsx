"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import GlitchText from "./GlitchText";

const SEQUENCE = [
  "It starts small.",
  "A single message.",
  "Then it grows.",
];

export default function Hero() {
  const [step, setStep] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SEQUENCE.forEach((_, i) => {
      timers.push(
        setTimeout(() => setStep(i + 1), i * 1800 + 600)
      );
    });
    timers.push(setTimeout(() => setShowCta(true), SEQUENCE.length * 1800 + 800));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] overflow-hidden scanlines">
      {/* CRT scanlines overlay is in globals.css */}
      <div className="z-10 flex flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4 min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence>
            {step >= 1 && (
              <motion.p
                key="s1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-pixel text-[#00ff41] text-lg md:text-2xl"
              >
                {SEQUENCE[0]}
              </motion.p>
            )}
            {step >= 2 && (
              <motion.p
                key="s2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-pixel text-[#00ff41] text-lg md:text-2xl"
              >
                {SEQUENCE[1]}
              </motion.p>
            )}
            {step >= 3 && (
              <motion.p
                key="s3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-pixel text-[#00ff41] text-lg md:text-2xl"
              >
                {SEQUENCE[2]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showCta && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="font-pixel text-[#00ff41] text-2xl md:text-4xl crt-flicker tracking-wide">
                NARRATIVE FARM
              </h1>
              <p className="font-pixel text-[#ff00ff] text-xs md:text-sm">
                <GlitchText text="Plant a signal. Watch it grow out of control." />
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/farm")}
                className="font-pixel text-[#0a0a0a] bg-[#00ff41] px-8 py-3 text-sm md:text-base hover:bg-[#00cc33] transition-colors border-2 border-[#00ff41] hover:shadow-[0_0_20px_#00ff41]"
              >
                Enter the farm &rarr;
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="absolute bottom-4 text-[#333] font-mono text-xs">
        <a
          href="https://github.com/cyber-dev0x/narrative-farm"
          id="github-link"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00ff41] transition-colors"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
