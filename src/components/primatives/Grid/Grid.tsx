import { makeResetStyles, tokens } from '@fluentui/react-components';

const useGridClassName = makeResetStyles({
    display: 'grid',
    gap: tokens.spacingVerticalL,
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsive columns
});

interface GridProps {
    children: React.ReactNode;
    className?: string;
}

const Grid: React.FC<GridProps> = ({ children, className }) => {
    return (
        <div className={`${useGridClassName()} ${className}`}>
            {children}
        </div>
    );
};

export default Grid;