import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSwitcherProps {
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to high-contrast light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to high-contrast light mode for well-lit environments' : 'Switch to dark mode'}
      className="relative flex items-center gap-1.5 p-2 rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-amber-500 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none pr-1">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
