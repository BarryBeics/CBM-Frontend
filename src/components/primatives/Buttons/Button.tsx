import { Button, useThemeClassName } from '@fluentui/react-components';

interface CustomButtonProps {
    onClick: () => void;
    appearance?: 'primary' | 'secondary' | 'outline' | 'subtle';
    icon?: JSX.Element;
    label: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, appearance = 'primary', icon, label }) => {
    const themeClassName = useThemeClassName();
    
    return (
        <Button
            appearance={appearance}
            icon={icon}
            onClick={onClick}
            className={themeClassName}
            aria-label={label}
        >
            {label}
        </Button>
    );
};

export default CustomButton;