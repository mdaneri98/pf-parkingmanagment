import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Spot } from '../types';
import { mockSpots } from '../utils/mockData';

interface SpotState {
  spots: Spot[];
  selectedSpot: Spot | null;
  filteredSpots: Spot[];
  loading: boolean;
  error: string | null;
}

const initialState: SpotState = {
  spots: mockSpots,
  selectedSpot: null,
  filteredSpots: mockSpots,
  loading: false,
  error: null,
};

const spotSlice = createSlice({
  name: 'spot',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Operaciones CRUD para Spot
    setSpots: (state, action: PayloadAction<Spot[]>) => {
      state.spots = action.payload;
      state.filteredSpots = action.payload;
      state.error = null;
    },
    
    addSpot: (state, action: PayloadAction<Spot>) => {
      state.spots.push(action.payload);
      state.filteredSpots = state.spots;
      state.error = null;
    },
    
    deleteSpot: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.spots.findIndex(spot => spot.id === id);
      if (index !== -1) {
        state.spots.splice(index, 1);
        state.filteredSpots = state.filteredSpots.filter(spot => spot.id !== id);
        
        if (state.selectedSpot?.id === id) {
          state.selectedSpot = null;
        }
        state.error = null;
      } else {
        state.error = `Espacio con ID ${id} no encontrado`;
      }
    },
    
    // Selección de spot
    selectSpot: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const spot = state.spots.find(spot => spot.id === id);
      if (spot) {
        state.selectedSpot = spot;
        state.error = null;
      } else {
        state.error = `Espacio con ID ${id} no encontrado`;
      }
    },
    
    clearSelectedSpot: (state) => {
      state.selectedSpot = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setSpots,
  addSpot,
  deleteSpot,
  selectSpot,
  clearSelectedSpot
} = spotSlice.actions;

export default spotSlice.reducer; 