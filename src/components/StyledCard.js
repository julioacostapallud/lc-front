import React from 'react';

// Componente simplificado que devuelve la imagen de la carta
const StyledCard = ({ data, isMyDeck, isDuel }) => {
    const { type, attack, speed, defence } = data;
    console.log(data);

    // Formar el nombre de archivo en función de los valores de `type`, `atk`, `spd`, y `vit`
    // const fileName = `card-${type}-${attack}${speed}${defence}-front.png`;

    // const source = require(`../icons/card-${type}-back.png`);

    const source = isMyDeck ? require(`../icons/card-${type}-${attack}${speed}${defence}-front.png`)
        : require(`../icons/card-${type}-back.png`)

    return (
        <img
            src={source}
            alt={`${type} card`}
            style={{ width: isDuel ? '100%' : '10%', height: isDuel ? '100%' : '10%', zIndex: '99999' }}
        />
    );
};

export default StyledCard;
