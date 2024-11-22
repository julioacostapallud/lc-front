// services/fake-services/index.js

import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

const tab = (n, numPlayers, playerData) => {
    if (!playerData) {
        return null;
    }

    const types = ["water", "fire", "plant"];
    const cardCombinations = [
        { attack: 3, defence: 2, speed: 1 },
        { attack: 3, defence: 1, speed: 2 },
        { attack: 2, defence: 3, speed: 1 },
        { attack: 2, defence: 1, speed: 3 },
        { attack: 1, defence: 3, speed: 2 },
        { attack: 1, defence: 2, speed: 3 },
    ];

    const board = Array.from({ length: n }, () => Array(n).fill(null));
    const players = [];

    // Función para obtener un elemento aleatorio de un array
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Función para generar un deck de 6 cartas
    const generateDeck = () => {
        return cardCombinations.map((combo) => ({
            ...combo,
            type: getRandomElement(types),
            id: uuidv4(),
        }));
    };

    // Función para verificar si hay un vecino del mismo jugador en horizontal o vertical
    const hasNeighbor = (x, y, playerName) => {
        const directions = [
            [0, 1], // derecha
            [1, 0], // abajo
            [0, -1], // izquierda
            [-1, 0], // arriba
        ];

        return directions.some(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            return nx >= 0 && ny >= 0 && nx < n && ny < n && board[nx][ny]?.player === playerName;
        });
    };

    // Asigna el casillero inicial para el jugador especificado en playerData
    const { name, terrains } = playerData;
    const playerX = terrains[0].x - 1; // Convertimos a índice basado en 0
    const playerY = terrains[0].y - 1;
    const playerType = terrains[0].type;

    // Aseguramos que el jugador de playerData esté en la posición correcta
    board[playerX][playerY] = { type: playerType, player: name };
    players.push({
        id: `player-${players.length + 1}`,
        name: name,
        terrains: [
            {
                owner: name,
                type: playerType,
                x: playerX + 1, // Ajuste para que x empiece desde 1
                y: playerY + 1, // Ajuste para que y empiece desde 1
            },
        ],
        deck: generateDeck(), // Genera el deck para este jugador
    });

    // Asigna casilleros iniciales aleatorios para otros jugadores
    for (let i = 0; i < numPlayers; i++) {
        if (i === players.length - 1) continue; // Omite al jugador actual ya asignado

        let x, y;
        let playerName = `Player ${i + 1}`;
        let playerType = getRandomElement(types);

        do {
            x = Math.floor(Math.random() * n);
            y = Math.floor(Math.random() * n);
        } while (board[x][y] !== null); // Repetir hasta encontrar un casillero vacío

        // Si el jugador no tiene nombre, su casillero queda desocupado
        const playerId = `player-${players.length + 1}`;
        const ownerName = Math.random() > 0.5 ? playerName : null;

        board[x][y] = ownerName
            ? { type: playerType, player: ownerName }
            : null;

        players.push({
            id: playerId,
            name: ownerName,
            terrains: ownerName
                ? [
                    {
                        owner: ownerName,
                        type: playerType,
                        x: x + 1, // Ajuste para que x empiece desde 1
                        y: y + 1, // Ajuste para que y empiece desde 1
                    },
                ]
                : [],
            deck: generateDeck(), // Genera el deck para cada jugador
        });
    }

    // Array para almacenar los casilleros desocupados
    const emptyCells = [];
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            if (board[x][y] === null) {
                emptyCells.push({ x, y });
            }
        }
    }

    // Asigna casilleros desocupados a los jugadores vecinos hasta que se ocupen todos
    while (emptyCells.length > 0) {
        let assigned = false;

        for (let i = 0; i < emptyCells.length; i++) {
            const { x, y } = emptyCells[i];

            // Busca un jugador vecino para asignar el casillero
            const neighborPlayer = players.find((player) =>
                hasNeighbor(x, y, player.name)
            );

            if (neighborPlayer && neighborPlayer.name) {
                // Asigna el casillero al jugador vecino encontrado
                const playerType = neighborPlayer.terrains[0]?.type || getRandomElement(types);
                board[x][y] = { type: playerType, player: neighborPlayer.name };
                neighborPlayer.terrains.push({
                    owner: neighborPlayer.name,
                    type: playerType,
                    x: x + 1, // Ajuste para que x empiece desde 1
                    y: y + 1, // Ajuste para que y empiece desde 1
                });

                // Elimina el casillero de la lista de casilleros desocupados
                emptyCells.splice(i, 1);
                assigned = true;
                break;
            }
        }

        // Verifica si no se asignó ningún casillero en esta pasada, evitando bucles infinitos
        if (!assigned) {
            console.error("No se pudo asignar un casillero adyacente. Verifica la lógica.");
            break;
        }
    }

    // Construye el objeto del juego
    const boardArray = [];
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            if (board[x][y]) {
                boardArray.push({ ...board[x][y], x: x + 1, y: y + 1 });
            }
        }
    }

    return {
        board: {
            rows: n,
            columns: n,
            casilleros: boardArray,
        },
        players: players,
    };
};

// Exporta todas las funciones dentro de un objeto "Fake"
export default {
    tab,
};
