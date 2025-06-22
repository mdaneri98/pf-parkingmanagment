import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ParkingLot } from '../types';
import { mockParkingLots } from '../utils/mockData';

interface ParkingLotState {
  parkingLots: ParkingLot[];
  selectedParkingLot: ParkingLot | null;
  filteredParkingLots: ParkingLot[];
  loading: boolean;
  error: string | null;
}

const initialState: ParkingLotState = {
  parkingLots: mockParkingLots,
  selectedParkingLot: null,
  filteredParkingLots: mockParkingLots,
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
    
    setParkingLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.parkingLots = action.payload;
      state.filteredParkingLots = action.payload;
      state.error = null;
    },
    
    addParkingLot: (state, action: PayloadAction<ParkingLot>) => {
      state.parkingLots.push(action.payload);
      state.filteredParkingLots = state.parkingLots;
      state.error = null;
    },
    
    updateParkingLot: (state, action: PayloadAction<{ id: number; updates: Partial<ParkingLot> }>) => {
      const { id, updates } = action.payload;
      const index = state.parkingLots.findIndex(lot => lot.id === id);
      if (index !== -1) {
        state.parkingLots[index] = { ...state.parkingLots[index], ...updates };
        
        if (state.selectedParkingLot?.id === id) {
          state.selectedParkingLot = { ...state.selectedParkingLot, ...updates };
        }
        
        const filteredIndex = state.filteredParkingLots.findIndex(lot => lot.id === id);
        if (filteredIndex !== -1) {
          state.filteredParkingLots[filteredIndex] = { ...state.filteredParkingLots[filteredIndex], ...updates };
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
        state.filteredParkingLots = state.filteredParkingLots.filter(lot => lot.id !== id);
        
        if (state.selectedParkingLot?.id === id) {
          state.selectedParkingLot = null;
        }
        state.error = null;
      } else {
        state.error = `Estacionamiento con ID ${id} no encontrado`;
      }
    },
    
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

    selectParkingLotByManagerId: (state, action: PayloadAction<number>) => {
      const managerId = action.payload;
      const parkingLot = state.parkingLots.find(lot => lot.manager_id === managerId);
      if (parkingLot) {
        state.selectedParkingLot = parkingLot;
        state.error = null;
      } else {
        state.error = `Estacionamiento para manager ${managerId} no encontrado`;
      }
    },
    
    clearSelectedParkingLot: (state) => {
      state.selectedParkingLot = null;
    },

    filterParkingLotsByAddress: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (searchTerm === '') {
        state.filteredParkingLots = state.parkingLots;
      } else {
        state.filteredParkingLots = state.parkingLots.filter(lot =>
          lot.address.toLowerCase().includes(searchTerm)
        );
      }
    },

    filterParkingLotsByManagerId: (state, action: PayloadAction<number>) => {
      const managerId = action.payload;
      state.filteredParkingLots = state.parkingLots.filter(lot => lot.manager_id === managerId);
    },

    clearFilters: (state) => {
      state.filteredParkingLots = state.parkingLots;
    },

    resetParkingLotState: (state) => {
      state.parkingLots = mockParkingLots;
      state.selectedParkingLot = null;
      state.filteredParkingLots = mockParkingLots;
      state.loading = false;
      state.error = null;
    }
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
  clearSelectedParkingLot,
  filterParkingLotsByAddress,
  filterParkingLotsByManagerId,
  clearFilters,
  resetParkingLotState
} = parkingLotSlice.actions;

export default parkingLotSlice.reducer; 