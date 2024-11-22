import './App.css';
import Fake from './services/fake-services';
import Background from './components/Background';
import Tab from './components/Tab';
import Duel from './components/Duel';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerData, setTab } from './store/playerSlice';
import useWebSocket from './services/websocket';

// Inicializar SweetAlert2 con React Content y tema oscuro
const MySwal = withReactContent(Swal);
Swal.mixin({
  customClass: {
    popup: 'swal-dark-popup',
    title: 'swal-dark-title',
    confirmButton: 'swal-dark-confirm-button',
  },
  background: '#2c2c2c',
  color: '#ffffff',
});

function App() {
  const dispatch = useDispatch();
  const playerData = useSelector((state) => state.player.playerData);
  const tabData = useSelector((state) => state.player.tab?.game);
  const myDeck = useSelector(state => state.player?.playerData?.deck)
  // const { isConnected, message, sendMessage } = useWebSocket(`ws://${window.location.hostname}:3000`);
  const { isConnected, message, sendMessage } = useWebSocket(`ws://192.168.0.139:3000`);
  console.log(`ws://${window.location.hostname}:3000`);

  // Sincronizar con localStorage al cargar la aplicación
  useEffect(() => {
    const storedPlayerData = localStorage.getItem('playerData');

    if (storedPlayerData && !playerData) {
      const parsedData = JSON.parse(storedPlayerData);
      console.log('Intentando reconexión con datos:', parsedData);

      if (isConnected) {
        sendMessage({
          action: 'user-reconnect',
          data: { id: parsedData.sessionId },
        });
      }
    }
  }, [dispatch, playerData, isConnected, sendMessage]);

  // Manejar mensajes del servidor
  useEffect(() => {
    if (message) {
      // console.log('Mensaje recibido del servidor:', message);
      try {
        const serverResponse = message;
        console.log(serverResponse);

        if (serverResponse.event === 'user-register' || serverResponse.event === 'user-reconnect') {
          if (serverResponse.data && !serverResponse.data.error) {
            const dataToStore = {
              name: serverResponse.data.name,
              terrains: serverResponse.data.terrains,
              deck: serverResponse.data.deck,
              id: serverResponse.data.id,
              sessionId: serverResponse.data.sessionId,
            };
            localStorage.setItem('playerData', JSON.stringify(dataToStore));
            localStorage.setItem('playerName', serverResponse.data.name);
            dispatch(setPlayerData(dataToStore));
            console.log('Datos sincronizados con localStorage y Redux:', dataToStore);

            if (isConnected) {
              sendMessage({
                action: 'update-game',
                data: {},
              });
            }

          } else if (serverResponse.data.error) {
            console.error('Error del servidor durante registro/reconexión:', serverResponse.data.error);
          }
        }

        if (serverResponse.event === 'update-game') {
          dispatch(setTab(serverResponse.data));
          console.log('Tab actualizado en Redux:', serverResponse.data);
        }
      } catch (error) {
        console.error('Error al procesar el mensaje del servidor:', error);
      }
    }
  }, [message, dispatch]);

  // Solicitar el nombre del usuario si no hay datos en localStorage ni en Redux
  useEffect(() => {
    if (!playerData && isConnected && !localStorage.getItem('playerData')) {
      MySwal.fire({
        title: 'Ingresa tu nombre',
        input: 'text',
        inputLabel: 'Nombre de usuario (máximo dos palabras)',
        inputPlaceholder: 'Ejemplo: Juan Pérez',
        inputValidator: (value) => {
          if (!value || value.trim().split(' ').length > 2) {
            return 'Por favor ingresa un nombre válido de máximo dos palabras';
          }
        },
        allowOutsideClick: false,
        showCancelButton: false,
        confirmButtonText: 'Guardar',
      }).then((result) => {
        if (result.isConfirmed) {
          const name = result.value.trim();
          localStorage.setItem('playerName', name);

          sendMessage({
            action: 'user-register',
            data: { name },
          });
          console.log(`Mensaje de registro enviado al servidor: Nombre: ${name}`);
        }
      });
    }
  }, [isConnected, playerData, sendMessage]);

  const tab = Fake.tab(5, 6, playerData);

  console.log(tab);
  console.log(tabData);

  const clearLocalStorage = () => {
    localStorage.clear();
    console.log('localStorage borrado');
    // Puedes también realizar alguna acción como reiniciar el estado de Redux si es necesario
    dispatch(setPlayerData(null)); // Limpia los datos del jugador en Redux
  };

  const selectDefensor = (idDefensor, deckDefensor) => {
    if (isConnected) {
      sendMessage({
        action: 'choose-defender',
        data: { id: idDefensor },
      });
      Duelo('Atacante', deckDefensor)
    }
  }

  const Duelo = (role, otherDeck) => {
    MySwal.fire({
      title: role === 'Atacante' ? 'Eligí las cartas para atacar' : 'Eligí las cartas para defenderte',
      html: <Duel myDeck={myDeck} otherDeck={otherDeck} />,
      showConfirmButton: false,
      width: '600px',
      padding: '20px',
    });
  }

  return (
    <div className="App">
      <Background />
      <h1 className="title-left">The Conquest</h1>
      <button
        onClick={clearLocalStorage}
        style={{
          padding: '10px 20px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Borrar localStorage
      </button>
      <h1 className="title-right gradient-text">Elementals Warfare</h1>
      <h5 className="title-right" style={{ color: 'white', zIndex: '99999', marginTop: '40px' }}>
        {isConnected ? 'Conectado' : 'Sin conexión'}
      </h5>
      {playerData && tabData && (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Tab tab={tabData} mainPlayer={playerData?.name} selectDefensor={selectDefensor} />
        </div>
      )}
    </div>
  );
}

export default App;
