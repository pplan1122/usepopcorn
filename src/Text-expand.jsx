import { useState } from 'react';

const boxStyle = {
    fontFamily: 'sans-serif',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '7px',
    backgroundColor: '#f7f7f7',
};

export default function TextExpander({
    children,
    collapsedNumber = 10,
    expandButtonText = 'Show text',
    collapsedButtonText = 'Collapse text',
    buttonColor = '#1f09cd',
    buttonInline = true,
    expanded = false,
    className = 'box',
}) {
    const buttonStyle = {
        border: 'none',
        backgroundColor: 'none',
        font: 'inherit',
        cursor: 'pointer',
        marginLeft: '6px',
        color: buttonColor,
        display: buttonInline ? 'inline-block' : 'block',
    };

    const [isCollapsed, setIsCollapsed] = useState(!expanded);
    return (
        <div style={boxStyle} className={className}>
            {isCollapsed
                ? children.split(' ').slice(0, collapsedNumber).join(' ')
                : children}
            <button
                style={buttonStyle}
                onClick={() => setIsCollapsed((isC) => !isC)}
            >
                {isCollapsed
                    ? `...${expandButtonText}`
                    : `...${collapsedButtonText}`}
            </button>
        </div>
    );
}
