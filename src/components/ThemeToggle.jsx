import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl p-1 shadow-lg">
      <button
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
          theme === "dark" ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
          theme === "light" ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ThemeToggle;
