import { makeResetStyles, tokens } from '@fluentui/react-components';

const useStackClassName = makeResetStyles({
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalL,
});

interface StackProps {
    children: React.ReactNode;
    className?: string;
}

const Stack: React.FC<StackProps> = ({ children, className }) => {
    return (
        <div className={`${useStackClassName()} ${className}`}>
            {children}
        </div>
    );
};

export default Stack;
