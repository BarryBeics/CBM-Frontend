import { Switch, useThemeClassName } from "@fluentui/react-components";

interface ThemeToggleProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
    const themeClass = useThemeClassName(); 

    return (
        <Switch
            label={isDarkMode ? "Dark Mode" : "Light Mode"} 
            checked={isDarkMode} 
            onChange={toggleTheme}
            aria-label="Toggle Theme"
            className={themeClass}
        />
    );
};

export default ThemeToggle;