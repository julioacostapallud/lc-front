// src/store/playerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    playerData: null,
    tab: null, // Nuevo atributo
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayerData: (state, action) => {
            state.playerData = action.payload;
        },
        setTab: (state, action) => {
            state.tab = action.payload; // Reducer para actualizar el tab
        },
        clearPlayerData: (state) => {
            state.playerData = null;
            state.tab = null; // También limpiamos el tab
        },
    },
});

export const { setPlayerData, setTab, clearPlayerData } = playerSlice.actions;
export default playerSlice.reducer;
