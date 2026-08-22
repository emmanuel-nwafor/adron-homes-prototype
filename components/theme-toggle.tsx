"use client";

import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      type="button"
      title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label="Toggle dark and light theme"
      className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-600" />
      )}
    </button>
  );
}
