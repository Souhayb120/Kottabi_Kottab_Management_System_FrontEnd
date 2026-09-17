import { Moon, Sun } from "lucide-react";

function ThemeToggle({ value, onToggle, light, dark, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={value ? light : dark}
      title={value ? light : dark}
      className={className || "p-2"}
    >
      {value ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export default ThemeToggle;