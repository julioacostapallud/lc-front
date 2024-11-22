// src/components/ViewPlayer.js
import React from "react";
import StyledCard from "./StyledCard"; // Importar el componente StyledCard

const ViewPlayer = ({ player, isMyDeck, selectDefensor }) => {
    if (!player) return <p>No se proporcionaron datos del jugador.</p>;

    // Obtener el tipo de terreno del primer casillero
    const firstTerrainType = player.terrains.length > 0 ? player.terrains[0].type : "Sin terreno";
    const source = require(`../icons/${firstTerrainType}.png`);

    // Contar cuántos casilleros tiene ese tipo de terreno
    const terrainCount = player.terrains.filter(terrain => terrain.type === firstTerrainType).length;

    return (
        <div style={{ border: "1px solid #ccc", padding: "20px", margin: "20px", borderRadius: "8px", background: "#000000" }}>
            <h3 style={{ marginBottom: "10px" }}>{isMyDeck ? 'Mis Datos' : 'Datos del Jugador'}</h3>
            <p><strong>Nombre:</strong> {player.name || "Sin nombre"}</p>
            <img
                src={source}
                alt={`${firstTerrainType} icon`}
                style={{ width: '10%', height: '10%', zIndex: '99999' }}
            />
            <p><strong>Cantidad:</strong> {terrainCount}</p>
            <div style={{ marginTop: "20px" }}>
                {/* <h4>Cartas:</h4> */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    {player.deck.map((card, index) => (
                        <StyledCard key={index} data={card} isMyDeck={isMyDeck} /> // Renderiza StyledCard para cada carta
                    ))}
                </div>
            </div>
            {!isMyDeck && (
                <button
                    onClick={() => selectDefensor(player.id, player.deck)}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Atacar
                </button>
            )}
        </div>
    );
};

export default ViewPlayer;
