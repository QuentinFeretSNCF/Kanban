import { Moon, Sun } from "lucide-react";
import type { Theme } from "../theme";

export default function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      className="studio-icon-btn-header"
      onClick={onToggle}
      title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
