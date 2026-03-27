"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <span className={`glitch-text relative inline-block ${className}`} data-text={text}>
      {text}
    </span>
  );
}
