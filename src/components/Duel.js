import React, { useState } from 'react';
import { Card, CardBody, Container, Button } from 'reactstrap';
import StyledCard from './StyledCard';
import { useSelector } from 'react-redux';

// Componente que representa un lugar para carta grande
const DropCard = ({ data, onDrop, index }) => {
    const cardStyle = {
        width: '110px',
        height: '145px',
        margin: '10px',
        borderRadius: '15px',
        border: '2px solid white',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
    };

    const handleDrop = (event) => {
        event.preventDefault();
        onDrop(index);
    };

    return (
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} style={cardStyle}>
            <CardBody className="d-flex justify-content-center align-items-center p-0">
                {data && <StyledCard data={data} isMyDeck={true} isDuel={true} />}
            </CardBody>
        </div>
    );
};

// Componente que representa una carta chica draggable
const DraggableCard = ({ id, data, onDragStart }) => {
    const style = {
        width: '59px',
        height: '63px',
        margin: '10px',
        borderRadius: '10px',
        border: '2px solid white',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        cursor: 'pointer'
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            style={style}
        >
            <CardBody className="d-flex justify-content-center align-items-center p-0">
                {data && <StyledCard data={data} isMyDeck={true} isDuel={true} />}
            </CardBody>
        </div>
    );
};

// Componente para representar un borde para carta chica vacía
const CardsBack = ({ data }) => {
    const style = {
        width: '59px',
        height: '63px',
        margin: '10px',
        borderRadius: '10px',
        border: '2px solid white',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        cursor: 'pointer'
    };

    return (
        <div style={style}>
            <CardBody className="d-flex justify-content-center align-items-center p-0">
                {data && <StyledCard data={data} isMyDeck={false} isDuel={true} />}
            </CardBody>
        </div>
    );
};

const Duel = ({ myDeck, otherDeck }) => {
    // const myDeck = [
    //     { type: 'fire', attack: 3, speed: 2, defence: 1 },
    //     { type: 'plant', attack: 2, speed: 3, defence: 1 },
    //     { type: 'water', attack: 1, speed: 2, defence: 3 },
    //     { type: 'fire', attack: 3, speed: 2, defence: 1 },
    //     { type: 'plant', attack: 2, speed: 3, defence: 1 },
    //     { type: 'water', attack: 1, speed: 2, defence: 3 },
    // ];

    const [largeCards, setLargeCards] = useState([null, null, null]);
    const [smallCards, setSmallCards] = useState(myDeck);
    const [draggedCardIndex, setDraggedCardIndex] = useState(null);

    // Inicia el arrastre de la carta chica y guarda su índice
    const handleDragStart = (event, index) => {
        setDraggedCardIndex(index);
    };

    // Maneja el movimiento de cartas de los lugares chicos a los específicos lugares grandes
    const handleDrop = (largeCardIndex) => {
        if (largeCards[largeCardIndex] === null && draggedCardIndex !== null) {
            const updatedLargeCards = [...largeCards];
            const updatedSmallCards = [...smallCards];

            // Mueve la carta al lugar específico de cartas grandes y deja vacío el lugar chico
            updatedLargeCards[largeCardIndex] = smallCards[draggedCardIndex];
            updatedSmallCards[draggedCardIndex] = null;

            // Actualiza los estados y reinicia el índice de la carta arrastrada
            setLargeCards(updatedLargeCards);
            setSmallCards(updatedSmallCards);
            setDraggedCardIndex(null);
        }
    };

    // Función para restablecer el estado inicial
    const handleReset = () => {
        setLargeCards([null, null, null]);
        setSmallCards(myDeck);
    };

    return (
        <Container
            style={{
                border: '2px solid white',
                borderRadius: '15px',
                padding: '15px',
                background: '#000000',
                // backgroundColor: 'transparent',
                maxWidth: '100%',
                position: 'relative',
                zIndex: 99999,
            }}
        >
            {/* Sección Superior (Defensor) - Lugares para cartas chicas */}
            <h5 className="text-center" style={{ color: 'white' }}>Defensor</h5>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {/* {Array(6).fill(null).map((_, i) => (
                    <CardsBack 
                        key={`small-${index}`}
                        id={index}
                        data={cardData}
                        onDragStart={handleDragStart}
                    />
                ))} */}

                {otherDeck.map((cardData, index) => (
                    <CardsBack
                        key={`small-${index}`}
                        id={index}
                        data={cardData}
                        onDragStart={handleDragStart}
                    />
                ))}
            </div>

            <hr style={{ borderTop: '2px dashed white' }} />

            {/* Sección Inferior (Atacante) - Lugares para cartas grandes y chicas */}
            <h5 className="text-center" style={{ color: 'white' }}>My Desk</h5>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {largeCards.map((cardData, i) => (
                    <div style={{ position: 'relative', display: 'inline-block' }} key={`large-${i}`}>
                        <DropCard data={cardData} onDrop={handleDrop} index={i} />
                        {/* Botón de deshacer */}
                    </div>
                ))}
                <Button
                    onClick={handleReset}
                    style={{
                        position: 'absolute',
                        top: '42%',
                        right: '45px',
                        transform: 'translateY(-50%)',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        fontSize: '16px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    D
                </Button>
            </div>

            {/* Lugares para cartas chicas en la sección de atacante */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {smallCards.map((cardData, index) => (
                    <DraggableCard
                        key={`small-${index}`}
                        id={index}
                        data={cardData}
                        onDragStart={handleDragStart}
                    />
                ))}
            </div>
        </Container>
    );
};

export default Duel;
