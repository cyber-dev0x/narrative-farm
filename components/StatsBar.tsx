"use client";

interface StatsBarProps {
  active: number;
  mutations: number;
  collapsed: number;
}

export default function StatsBar({ active, mutations, collapsed }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center font-pixel text-xs text-[#00ff41] bg-[#0d0d0d] border border-[#00ff41]/30 px-4 py-2 rounded">
      <span>
        Signals active: <span className="text-[#00ff41]">{active}</span>
      </span>
      <span className="text-[#00ff41]/30">|</span>
      <span>
        Mutations: <span className="text-[#ff00ff]">{mutations}</span>
      </span>
      <span className="text-[#00ff41]/30">|</span>
      <span>
        Collapsed: <span className="text-[#555]">{collapsed}</span>
      </span>
    </div>
  );
}
