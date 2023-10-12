import { useState } from 'react';
import PropTypes from 'prop-types';

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};
const starContainerStyle = {
    display: 'flex',
    // gap: '4px',
};

const starStyle = {
    display: 'block',
    cursor: 'pointer',
};

StarRating.PropTypes = {
    maxRating: PropTypes.number.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    className: PropTypes.string,
    message: PropTypes.array,
    defaultRating: PropTypes.number,
    onSetRating: PropTypes.func,
};

export default function StarRating({
    color = '#fcc419',
    maxRating = 10,
    size = 24,
    className = '',
    defaultRating = 0,
    message = [],
    onSetRating,
}) {
    const [rating, setRating] = useState(defaultRating);
    const [tempRating, setTempRating] = useState(0);

    const textStyle = {
        lineHeight: '1',
        margin: '0',
        color,
        fontSize: `${size / 1.5}px`,
    };

    function handleRating(rating) {
        setRating(rating);
        onSetRating(rating);
    }

    return (
        <div style={containerStyle} className={className}>
            <div style={starContainerStyle}>
                {Array.from({ length: maxRating }, (_, index) => (
                    <Star
                        key={index}
                        onRate={() => handleRating(index + 1)}
                        full={rating > index || tempRating > index}
                        color={color}
                        size={size}
                        onHandleMouseEnter={() => setTempRating(index + 1)}
                        onHandleMouseOut={() => setTempRating(0)}
                    />
                ))}
            </div>
            <span style={textStyle}>
                {message && message.length === maxRating
                    ? message[(tempRating || rating) - 1]
                    : rating}
            </span>
        </div>
    );
}

function Star({
    onRate,
    full,
    color,
    size,
    onHandleMouseEnter,
    onHandleMouseOut,
}) {
    return (
        <span
            style={{ ...starStyle, height: `${size}px`, width: `${size}px` }}
            onClick={onRate}
            onMouseEnter={onHandleMouseEnter}
            onMouseLeave={onHandleMouseOut}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={full ? color : 'none'}
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={color}
                class="icon"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
            </svg>
        </span>
    );
}
