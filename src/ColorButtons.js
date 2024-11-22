// src/components/ColorButtons.js
import React from 'react';
import colors from './colors';

const ColorButtons = () => {
    // Genera un botón para cada color en la paleta
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '20px' }}>
            {Object.keys(colors).map((colorKey) => (
                <button
                    key={colorKey}
                    style={{
                        backgroundColor: colors[colorKey],
                        color: colorKey.includes('light') ? '#000' : '#FFF', // Texto negro en colores claros y blanco en oscuros
                        border: 'none',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}
                >
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default ColorButtons;
