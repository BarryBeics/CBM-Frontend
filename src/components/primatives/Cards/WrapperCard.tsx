import { Card, useThemeClassName } from '@fluentui/react-components';

interface WrapperCardProps {
    children: React.ReactNode;
}

const WrapperCard: React.FC<WrapperCardProps> = ({ children }) => {
    const themeClassName = useThemeClassName();
    return (
        <Card className={`list-card ${themeClassName}`}> 

            {/* Card Content */}
            <div>
                {children}
            </div>
        </Card>
    );
};

export default WrapperCard;