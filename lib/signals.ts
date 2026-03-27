export type GrowthStage =
  | "seed"
  | "sprout"
  | "plant"
  | "bloom"
  | "mutant"
  | "collapsed";

export interface Signal {
  id: string;
  originalText: string;
  currentText: string;
  ticks: number;
  stage: GrowthStage;
  mutationHistory: string[];
  wateredUntil: number; // tick count until watering bonus expires
  plantedAt: number; // timestamp
}

export type FarmGrid = (Signal | null)[];

export const STAGE_THRESHOLDS: Record<GrowthStage, [number, number]> = {
  seed: [0, 3],
  sprout: [4, 7],
  plant: [8, 14],
  bloom: [15, 20],
  mutant: [21, 28],
  collapsed: [29, Infinity],
};

export const STAGE_COLORS: Record<GrowthStage, string> = {
  seed: "#00ff41",
  sprout: "#aaff00",
  plant: "#ffdd00",
  bloom: "#ff8800",
  mutant: "#ff00ff",
  collapsed: "#555555",
};

export const STAGE_EMOJI: Record<GrowthStage, string> = {
  seed: "🌱",
  sprout: "🌿",
  plant: "🌾",
  bloom: "🌺",
  mutant: "☣️",
  collapsed: "💀",
};

const PREFIXES = [
  "They say... ",
  "Apparently, ",
  "BREAKING: ",
  "Sources confirm: ",
  "Leaked: ",
  "Unverified but: ",
  "Thread: ",
  "PSA — ",
];

const SUFFIXES = [
  " ...and nobody is talking about it.",
  " ...this changes everything.",
  " ...is this real?",
  " #WakeUp",
  " RT if you agree.",
  " Do your own research.",
  " They don't want you to know.",
];

function applyMutation(text: string): string {
  const roll = Math.random();
  if (roll < 0.25) {
    // prefix
    const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    return p + text;
  } else if (roll < 0.5) {
    // suffix
    const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return text + s;
  } else if (roll < 0.65) {
    // ALL CAPS key words
    return text.replace(/\b(the|a|is|are|was|were)\b/gi, (m) =>
      m.toUpperCase()
    );
  } else if (roll < 0.8) {
    // add !!!
    return text.replace(/[.!?]*$/, "!!!");
  } else if (roll < 0.9) {
    // replace "said" / "says" with "ADMITS"
    return text.replace(/\b(said|says|told|wrote)\b/gi, "ADMITS");
  } else {
    // wrap in quotes and add skepticism
    return `"${text}" — but at what cost?`;
  }
}

export function getStage(ticks: number): GrowthStage {
  if (ticks <= 3) return "seed";
  if (ticks <= 7) return "sprout";
  if (ticks <= 14) return "plant";
  if (ticks <= 20) return "bloom";
  if (ticks <= 28) return "mutant";
  return "collapsed";
}

export function tickSignal(signal: Signal): Signal {
  if (signal.stage === "collapsed") return signal;

  const isWatered = signal.ticks < signal.wateredUntil;
  const increment = isWatered ? 2 : 1;
  const newTicks = signal.ticks + increment;
  const oldStage = signal.stage;
  const newStage = getStage(newTicks);

  // 20% chance to collapse at mutant stage
  if (oldStage === "mutant" && Math.random() < 0.2) {
    return {
      ...signal,
      ticks: newTicks,
      stage: "collapsed",
      mutationHistory: [
        ...signal.mutationHistory,
        "[signal collapsed from overexposure]",
      ],
    };
  }

  let currentText = signal.currentText;
  const mutationHistory = [...signal.mutationHistory];

  if (newStage !== oldStage && newStage !== "collapsed") {
    const mutated = applyMutation(currentText);
    mutationHistory.push(mutated);
    currentText = mutated;
  }

  return {
    ...signal,
    ticks: newTicks,
    stage: newStage,
    currentText,
    mutationHistory,
  };
}

export function waterSignal(signal: Signal): Signal {
  return {
    ...signal,
    wateredUntil: signal.ticks + 5,
  };
}

export function createSignal(text: string): Signal {
  return {
    id: Math.random().toString(36).slice(2),
    originalText: text,
    currentText: text,
    ticks: 0,
    stage: "seed",
    mutationHistory: [text],
    wateredUntil: 0,
    plantedAt: Date.now(),
  };
}

export function computeStats(grid: FarmGrid) {
  const signals = grid.filter(Boolean) as Signal[];
  const active = signals.filter((s) => s.stage !== "collapsed").length;
  const mutations = signals.reduce(
    (acc, s) => acc + Math.max(0, s.mutationHistory.length - 1),
    0
  );
  const collapsed = signals.filter((s) => s.stage === "collapsed").length;
  return { active, mutations, collapsed };
}
