import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@stores/store';


interface AppState {
  sidebarOpen: boolean;
}

const initialState: AppState = {
  sidebarOpen: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    }
  },
});

// Actions
export const { toggleSidebar, setSidebarOpen } = appSlice.actions;

// Reducer
export const appReducer = appSlice.reducer;

// Selectors
export const selectIsSidebarOpen = (state: RootState) => state.app.sidebarOpen;
