import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ViewPlayer from './ViewPlayer'; // Ajusta la ruta si es necesario
import colors from '../colors';

// Importa los íconos
import fireIcon from '../icons/fire.png';
import plantIcon from '../icons/plant.png';
import waterIcon from '../icons/water.png';
import { useSelector } from 'react-redux';

const MySwal = withReactContent(Swal);

const getColorForPlayer = (type, isMainPlayer) => {
    switch (type) {
        case 'water':
            return isMainPlayer ? colors.aguaDark : colors.agua;
        case 'fire':
            return isMainPlayer ? colors.fuegoDark : colors.fuego;
        case 'plant':
            return isMainPlayer ? colors.plantaDark : colors.planta;
        default:
            return colors.background; // Gris para casilleros sin jugador
    }
};

const getInitials = (playerName) => {
    if (!playerName) return ''; // No iniciales para jugadores sin nombre
    const words = playerName.trim().split(/\s+/);
    return words.slice(0, 2).map(word => word[0].toUpperCase()).join('');
};

const getIconForType = (type) => {
    switch (type) {
        case 'water':
            return waterIcon;
        case 'fire':
            return fireIcon;
        case 'plant':
            return plantIcon;
        default:
            return null;
    }
};

const Tab = ({ tab, mainPlayer, selectDefensor }) => {
    const { rows, columns } = tab.board; // Nuevo formato para filas y columnas
    const players = tab.players || [];
    const [highlightedPlayer, setHighlightedPlayer] = useState(null);

    const idMainPlayer = useSelector(state => state.player.playerData.id)

    // Genera la matriz del tablero
    const grid = Array.from({ length: rows }, () => Array(columns).fill(null));

    // Mapear terrenos desde la nueva estructura de jugadores
    players.forEach(player => {
        if (player.name) {
            player.terrains.forEach(({ type, x, y }) => {
                grid[x - 1][y - 1] = { type, player: player.name, playerData: player }; // Agregar datos del jugador
            });
        } else {
            player.terrains.forEach(({ x, y }) => {
                grid[x - 1][y - 1] = null; // Casillero gris para jugadores sin nombre
            });
        }
    });

    const getBorderStyle = (x, y, player, playerColor) => {
        const borderStyles = {};
        const radiusStyles = {};

        const neighbors = {
            top: x > 0 ? grid[x - 1][y] : null,
            right: y < columns - 1 ? grid[x][y + 1] : null,
            bottom: x < rows - 1 ? grid[x + 1][y] : null,
            left: y > 0 ? grid[x][y - 1] : null,
        };

        borderStyles.borderTop = neighbors.top && neighbors.top.player === player
            ? `1px solid ${playerColor}`
            : '1px solid black';
        borderStyles.borderRight = neighbors.right && neighbors.right.player === player
            ? `1px solid ${playerColor}`
            : '1px solid black';
        borderStyles.borderBottom = neighbors.bottom && neighbors.bottom.player === player
            ? `1px solid ${playerColor}`
            : '1px solid black';
        borderStyles.borderLeft = neighbors.left && neighbors.left.player === player
            ? `1px solid ${playerColor}`
            : '1px solid black';

        if (!neighbors.top && !neighbors.left) radiusStyles.borderTopLeftRadius = '10px';
        if (!neighbors.top && !neighbors.right) radiusStyles.borderTopRightRadius = '10px';
        if (!neighbors.bottom && !neighbors.left) radiusStyles.borderBottomLeftRadius = '10px';
        if (!neighbors.bottom && !neighbors.right) radiusStyles.borderBottomRightRadius = '10px';

        return { ...borderStyles, ...radiusStyles };
    };

    const handleCellClick = (cell) => {
        if (!cell || !cell.playerData) return;
        const isMyDeck = false || cell.playerData.id === idMainPlayer

        MySwal.fire({
            html: <ViewPlayer player={cell.playerData} isMyDeck={isMyDeck} selectDefensor={selectDefensor} />,
            showConfirmButton: false,
            width: '600px',
            padding: '20px',
        });
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(clamp(60px, 50vw, 100px), 1fr))`,
                gap: '2px', // Espaciado entre casilleros
                padding: '10px',
                maxWidth: '70%',
            }}
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const isHighlighted = cell && highlightedPlayer === cell.player;
                    const isMainPlayer = cell && cell.player === mainPlayer;
                    const playerColor = cell ? getColorForPlayer(cell.type, isMainPlayer) : colors.borderColor;
                    const playerInitials = cell ? getInitials(cell.player) : '';
                    const icon = cell ? getIconForType(cell.type) : null;

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            onMouseEnter={() => setHighlightedPlayer(cell ? cell.player : null)}
                            onMouseLeave={() => setHighlightedPlayer(null)}
                            onClick={() => handleCellClick(cell)} // Maneja el click
                            style={{
                                width: '100%',
                                paddingTop: '100%', // Mantiene relación de aspecto cuadrada
                                backgroundColor: playerColor,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'black',
                                fontWeight: 'bold',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                filter: isHighlighted ? 'brightness(1.3)' : 'brightness(1)',
                                ...getBorderStyle(rowIndex, colIndex, cell ? cell.player : '', playerColor),
                            }}
                        >
                            {icon && (
                                <img
                                    src={icon}
                                    alt={cell.type}
                                    style={{
                                        position: 'absolute',
                                        top: '5%',
                                        left: '5%',
                                        width: '20px',
                                        height: '20px',
                                    }}
                                />
                            )}
                            {cell && (
                                <span style={{
                                    position: 'absolute',
                                    top: '5%',
                                    right: '5%',
                                    fontSize: 'clamp(8px, 1.2vw, 12px)',
                                    fontWeight: 'bold',
                                    color: isMainPlayer ? 'white' : 'black',
                                }}>
                                    {playerInitials}
                                </span>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Tab;
