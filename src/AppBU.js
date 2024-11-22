import './App.css';
import Fake from './services/fake-services';
import Tab from './components/Tab';
import Duel from './components/Duel';
import StyledCard from './components/StyledCard';
import Background from './components/Background';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerData } from './store/playerSlice';
import useWebSocket from './services/websocket';

function App() {
  const dispatch = useDispatch();
  const playerData = useSelector((state) => state.player.playerData);
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const { isConnected, message, sendMessage } = useWebSocket('ws://localhost:3000');

  // Sincronizar con localStorage al cargar la aplicación
  useEffect(() => {
    const storedPlayerData = localStorage.getItem('playerData');
    if (storedPlayerData && !playerData) {
      dispatch(setPlayerData(JSON.parse(storedPlayerData)));
    }
  }, [dispatch, playerData]);

  // Manejar mensajes del servidor
  useEffect(() => {
    if (message) {
      console.log('Mensaje recibido del servidor:', message);
      try {
        const serverResponse = JSON.parse(message);

        if (serverResponse.event === 'user-register' || serverResponse.event === 'user-reconnect') {
          if (serverResponse.data && !serverResponse.data.error) {
            const dataToStore = {
              name: serverResponse.data.name,
              terrains: serverResponse.data.terrains,
              deck: serverResponse.data.deck,
              id: serverResponse.data.id,
            };
            localStorage.setItem('playerData', JSON.stringify(dataToStore));
            localStorage.setItem('playerName', serverResponse.data.name);
            dispatch(setPlayerData(dataToStore));
            console.log('Datos del jugador guardados en localStorage y Redux:', dataToStore);
          } else if (serverResponse.data.error) {
            console.error('Error del servidor:', serverResponse.data.error);
          }
        }
      } catch (error) {
        console.error('Error al procesar el mensaje del servidor:', error);
      }
    }
  }, [message, dispatch]);

  // Solicitar el nombre solo cuando esté conectado
  useEffect(() => {
    if (!playerData && isConnected && !localStorage.getItem('playerData')) {
      Swal.fire({
        title: 'Ingresa tu nombre',
        input: 'text',
        inputLabel: 'Nombre de usuario (máximo 2 palabras)',
        inputPlaceholder: 'Ejemplo: Juan Pérez',
        inputValidator: (value) => {
          if (!value || value.trim().split(' ').length > 2) {
            return 'Por favor ingresa un nombre válido de máximo 2 palabras';
          }
        },
        allowOutsideClick: false,
        showCancelButton: false,
        confirmButtonText: 'Guardar',
        customClass: {
          confirmButton: 'my-swal-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const name = result.value.trim();
          setPlayerName(name);
          localStorage.setItem('playerName', name);

          // Envía el mensaje de registro al servidor
          sendMessage({
            action: 'user-register',
            data: { name },
          });
          console.log(`Mensaje de registro enviado al servidor: Nombre: ${name}`);
        }
      });
    }
  }, [isConnected, playerData, sendMessage]);

  const tab = Fake.tab(2, 4, playerData);
  console.log(playerData);

  const desk = [
    { type: 'fuego', atk: 3, spd: 2, vit: 1 },
    { type: 'planta', atk: 2, spd: 3, vit: 1 },
    { type: 'agua', atk: 1, spd: 2, vit: 3 },
    { type: 'fuego', atk: 3, spd: 2, vit: 1 },
    { type: 'planta', atk: 2, spd: 3, vit: 1 },
    { type: 'agua', atk: 1, spd: 2, vit: 3 },
  ];

  return (
    <div className="App">
      {/* Fondo animado */}
      {/* <Background /> */}
      <h1 className="title-left">The Conquest</h1>
      <p style={{ color: 'white', zIndex: '99999' }}>
        {isConnected ? 'Conectado al servidor' : 'Sin conexión con el servidor'}
      </p>
      <h1 className="title-right gradient-text">Elementals Warfare</h1>
      {playerData && (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Tab tab={tab} mainPlayer={playerData?.name || playerName} />
        </div>
      )}
      <div style={{ marginTop: '20px', color: 'white' }}>
        <p>Mensaje del servidor: {message}</p>
      </div>
    </div>
  );
}

export default App;
