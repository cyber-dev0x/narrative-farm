import FarmGrid from "@/components/FarmGrid";
import Link from "next/link";

export default function FarmPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] scanlines flex flex-col">
      <header className="border-b border-[#00ff41]/20 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-pixel text-[#00ff41] text-xs hover:text-[#00cc33] transition-colors">
          &larr; NARRATIVE FARM
        </Link>
        <span className="font-pixel text-[#333] text-[10px]">v1.0</span>
      </header>

      <main className="flex-1 py-8">
        <FarmGrid />
      </main>

      <footer className="border-t border-[#00ff41]/10 px-4 py-3 text-center">
        <a
          href="https://github.com/cyber-dev0x/narrative-farm"
          id="github-link"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[#333] text-xs hover:text-[#00ff41] transition-colors"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
