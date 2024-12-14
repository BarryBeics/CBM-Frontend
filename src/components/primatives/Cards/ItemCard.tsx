import { Card, CardPreview, Subtitle2, CardFooter, useThemeClassName, makeStyles, tokens } from '@fluentui/react-components';
import './Cards.css';
import React from 'react';

const useStyles = makeStyles({
    previewBg: {
        backgroundColor: tokens.colorNeutralBackground2, 
    },
});


interface ItemCardProps {
    title: React.ReactNode;
    svgSrc: string;
    svgAlt: string;
    turnover?: React.ReactNode;
    leasehold?: React.ReactNode;
    children: React.ReactNode;
    footerContent?: React.ReactNode;
}

const ItemCard: React.FC<ItemCardProps> = React.memo(({ 
    title,
    svgSrc,
    svgAlt,
    turnover,
    leasehold,
    children,
    footerContent
}) => {
    const classes = useStyles();
    const themeClassName = useThemeClassName();
  
    
    
    return (
        <Card className={`list-card ${themeClassName}` }>  {/* Apply dynamic class here */}
            <Subtitle2 className='subtitle-spacing'>
                {title}
            </Subtitle2>
            <CardPreview className={`${classes.previewBg}`}>
                <img 
                src={svgSrc}
                alt={svgAlt}
                className='list-card-image'
                />
            </CardPreview>
            {/* Turnover and Leasehold */}
            {turnover && (
                <div className="card-turnover">
                {turnover}
                </div>
            )}
            {leasehold && (
                <div className="card-leasehold">
                {leasehold}
                </div>
            )}

            {/* Card Content */}
            <div>
                {children}
            </div>

            {/* Optional Footer */}
            {footerContent && (
                <CardFooter className='card-footer'>
                    {footerContent}
                </CardFooter>
            )}
        </Card>
    );
});

export default ItemCard;