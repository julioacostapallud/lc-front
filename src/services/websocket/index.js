import { useState, useEffect, useCallback } from 'react';

function useWebSocket(url) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState(null);

    // Establecer conexión WebSocket
    useEffect(() => {
        if (!url) return;

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Conexión establecida con el servidor WebSocket');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            console.log('Mensaje recibido del servidor:', event.data);
            setMessage(JSON.parse(event.data)); // Parsear el mensaje para uso directo
        };

        ws.onclose = () => {
            console.log('Conexión WebSocket cerrada');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('Error en el WebSocket:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    // Enviar mensajes al servidor
    const sendMessage = useCallback(
        (data) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                console.log('Enviando mensaje al servidor:', JSON.stringify(data));
                socket.send(JSON.stringify(data));
            } else {
                console.warn('WebSocket no está conectado. No se puede enviar el mensaje.');
            }
        },
        [socket]
    );

    return {
        isConnected,
        message,
        sendMessage, // Garantizar que sendMessage esté disponible
    };
}

export default useWebSocket;
