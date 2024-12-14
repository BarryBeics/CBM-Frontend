import { Button } from '@fluentui/react-components';

interface IconButtonProps {
    onClick: () => void;
    icon: JSX.Element;             
    label: string;                 
    title: string;                 
    ariaLabel: string;             
    appearance?: 'primary' | 'secondary' | 'transparent' | 'outline' | 'subtle';
    color?: string;                
    className?: string;           
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, label, title, ariaLabel, appearance = 'transparent', color, className }) => {
    return (
        <Button
            icon={icon}
            onClick={onClick}
            appearance={appearance}
            title={title}
            aria-label={ariaLabel}
            style={{ color }}
            className={className}
        >
            <span className='button-text'>{label}</span>
        </Button>
    );
};

export default IconButton;
