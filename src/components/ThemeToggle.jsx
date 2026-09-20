import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function ThemeToggle({ value, onToggle, light, dark, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={value ? light : dark}
      title={value ? light : dark}
      className={className || "p-2"}
    >
      {value ? <FontAwesomeIcon icon={faSun} className="h-5 w-5" /> : <FontAwesomeIcon icon={faMoon} className="h-5 w-5" />}
    </button>
  );
}

export default ThemeToggle;