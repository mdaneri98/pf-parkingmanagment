import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ParkingLot } from '../types';
import { mockParkingLots } from '../utils/mockData';

interface ParkingLotState {
  parkingLots: ParkingLot[];
  selectedParkingLot: ParkingLot | null;
  loading: boolean;
  error: string | null;
}

const initialState: ParkingLotState = {
  parkingLots: mockParkingLots,
  selectedParkingLot: null,
  loading: false,
  error: null,
};

const parkingLotSlice = createSlice({
  name: 'parkingLot',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Operaciones CRUD para ParkingLot
    setParkingLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.parkingLots = action.payload;
      state.error = null;
    },
    
    addParkingLot: (state, action: PayloadAction<ParkingLot>) => {
      state.parkingLots.push(action.payload);
      state.error = null;
    },

    selectParkingLotByManagerId: (state, action: PayloadAction<number>) => {
      const managerId = action.payload;
      const parkingLot = state.parkingLots.find(lot => lot.manager_id === managerId);
      if (parkingLot) {
        state.selectedParkingLot = parkingLot;
        state.error = null;
      } else {
        state.error = `Estacionamiento con ID ${managerId} no encontrado`;
      }
    },
    
    updateParkingLot: (state, action: PayloadAction<{ id: number; updates: Partial<ParkingLot> }>) => {
      const { id, updates } = action.payload;
      const index = state.parkingLots.findIndex(lot => lot.id === id);
      if (index !== -1) {
        state.parkingLots[index] = { ...state.parkingLots[index], ...updates };
        
        if (state.selectedParkingLot?.id === id) {
          state.selectedParkingLot = { ...state.selectedParkingLot, ...updates };
        }
        state.error = null;
      } else {
        state.error = `Estacionamiento con ID ${id} no encontrado`;
      }
    },
    
    deleteParkingLot: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.parkingLots.findIndex(lot => lot.id === id);
      if (index !== -1) {
        state.parkingLots.splice(index, 1);
        
        // Limpiar selección si era el estacionamiento eliminado
        if (state.selectedParkingLot?.id === id) {
          state.selectedParkingLot = null;
        }
        state.error = null;
      } else {
        state.error = `Estacionamiento con ID ${id} no encontrado`;
      }
    },
    
    // Selección de estacionamiento
    selectParkingLot: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const parkingLot = state.parkingLots.find(lot => lot.id === id);
      if (parkingLot) {
        state.selectedParkingLot = parkingLot;
        state.error = null;
      } else {
        state.error = `Estacionamiento con ID ${id} no encontrado`;
      }
    },
    
    clearSelectedParkingLot: (state) => {
      state.selectedParkingLot = null;
    },

  },
});

export const {
  setLoading,
  setError,
  setParkingLots,
  addParkingLot,
  updateParkingLot,
  deleteParkingLot,
  selectParkingLot,
  selectParkingLotByManagerId,
  clearSelectedParkingLot
} = parkingLotSlice.actions;

export default parkingLotSlice.reducer; 