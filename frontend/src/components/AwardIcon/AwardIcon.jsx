import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAwardLabels } from '../../utils/awards.js';
import flayIcon from '../../assets/images/flay.svg';

export default function AwardIcon({ awards, className }) {
    const [hover, setHover] = useState(false);
    const [tooltipPos, setTooltipPos] = useState(null);
    const iconRef = useRef(null);
    const labels = getAwardLabels(awards);

    useEffect(() => {
        if (!hover || !iconRef.current || typeof document === 'undefined') return;
        const rect = iconRef.current.getBoundingClientRect();
        setTooltipPos({ left: rect.left + rect.width / 2, bottom: window.innerHeight - rect.top + 8 });
    }, [hover]);

    if (!awards?.length || !labels.length) return null;

    const tooltip = hover && tooltipPos && (
        <div
            className="award-tooltip award-tooltip--portal"
            role="tooltip"
            style={{
                position: 'fixed',
                left: tooltipPos.left,
                bottom: tooltipPos.bottom,
                transform: 'translateX(-50%)',
                zIndex: 9999,
            }}
        >
            <span className="award-tooltip__title">Nominations</span>
            <ul className="award-tooltip__list">
                {labels.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </div>
    );

    return (
        <span
            ref={iconRef}
            className={`award-icon-wrap${className ? ` ${className}` : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setTooltipPos(null);
            }}
        >
            <span className="award-icon" aria-hidden="true">
                <img src={flayIcon} alt="" width={14} height={14} />
            </span>
            {typeof document !== 'undefined' && tooltip && createPortal(tooltip, document.body)}
        </span>
    );
}
