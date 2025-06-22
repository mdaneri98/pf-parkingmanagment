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
    
    updateSpot: (state, action: PayloadAction<{ id: number; updates: Partial<Spot> }>) => {
      const { id, updates } = action.payload;
      const index = state.spots.findIndex(spot => spot.id === id);
      if (index !== -1) {
        state.spots[index] = { ...state.spots[index], ...updates };
        
        if (state.selectedSpot?.id === id) {
          state.selectedSpot = { ...state.selectedSpot, ...updates };
        }
        
        const filteredIndex = state.filteredSpots.findIndex(spot => spot.id === id);
        if (filteredIndex !== -1) {
          state.filteredSpots[filteredIndex] = { ...state.filteredSpots[filteredIndex], ...updates };
        }
        
        state.error = null;
      } else {
        state.error = `Espacio con ID ${id} no encontrado`;
      }
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
    },

    toggleSpotAvailability: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const spot = state.spots.find(spot => spot.id === id);
      if (spot) {
        spot.is_available = !spot.is_available;
        
        const filteredSpot = state.filteredSpots.find(spot => spot.id === id);
        if (filteredSpot) {
          filteredSpot.is_available = spot.is_available;
        }
        
        if (state.selectedSpot?.id === id) {
          state.selectedSpot.is_available = spot.is_available;
        }
        
        state.error = null;
      } else {
        state.error = `Espacio con ID ${id} no encontrado`;
      }
    },

    setSpotAvailability: (state, action: PayloadAction<{ id: number; isAvailable: boolean }>) => {
      const { id, isAvailable } = action.payload;
      const spot = state.spots.find(spot => spot.id === id);
      if (spot) {
        spot.is_available = isAvailable;
        
        const filteredSpot = state.filteredSpots.find(spot => spot.id === id);
        if (filteredSpot) {
          filteredSpot.is_available = isAvailable;
        }
        
        if (state.selectedSpot?.id === id) {
          state.selectedSpot.is_available = isAvailable;
        }
        
        state.error = null;
      } else {
        state.error = `Espacio con ID ${id} no encontrado`;
      }
    },

    filterSpotsByParkingLot: (state, action: PayloadAction<number>) => {
      const parkingLotId = action.payload;
      state.filteredSpots = state.spots.filter(spot => spot.parking_lot_id === parkingLotId);
    },

    filterSpotsByVehicleType: (state, action: PayloadAction<string>) => {
      const vehicleType = action.payload;
      if (vehicleType === '') {
        state.filteredSpots = state.spots;
      } else {
        state.filteredSpots = state.spots.filter(spot => 
          spot.vehicle_type.toLowerCase() === vehicleType.toLowerCase()
        );
      }
    },

    filterSpotsByAvailability: (state, action: PayloadAction<boolean | null>) => {
      const isAvailable = action.payload;
      if (isAvailable === null) {
        state.filteredSpots = state.spots;
      } else {
        state.filteredSpots = state.spots.filter(spot => spot.is_available === isAvailable);
      }
    },

    clearFilters: (state) => {
      state.filteredSpots = state.spots;
    },

    resetSpotState: (state) => {
      state.spots = mockSpots;
      state.selectedSpot = null;
      state.filteredSpots = mockSpots;
      state.loading = false;
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setSpots,
  addSpot,
  updateSpot,
  deleteSpot,
  selectSpot,
  clearSelectedSpot,
  toggleSpotAvailability,
  setSpotAvailability,
  filterSpotsByParkingLot,
  filterSpotsByVehicleType,
  filterSpotsByAvailability,
  clearFilters,
  resetSpotState
} = spotSlice.actions;

export default spotSlice.reducer; 