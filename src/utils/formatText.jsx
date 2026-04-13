import React from 'react';

export const formatText = (text) => {
    if (typeof text !== 'string') return text;
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
        part.startsWith('**') && part.endsWith('**') 
            ? <strong key={i} className="font-semibold text-[var(--text-main)]">{part.slice(2, -2)}</strong> 
            : part
    );
};
