import { useState, useCallback } from 'react';
import type { ParkingLotResponse } from '@parking/types';

interface SettingsModalState {
  lotSettings: boolean;
  createLot: boolean;
}

interface SettingsConfirmDeleteState {
  type: 'lot';
  id: number;
}

type SettingsModalType = keyof SettingsModalState;

const initialModalState: SettingsModalState = {
  lotSettings: false,
  createLot: false,
};

export function useSettingsModalState() {
  const [modals, setModals] = useState<SettingsModalState>(initialModalState);
  const [confirmDelete, setConfirmDelete] = useState<SettingsConfirmDeleteState | null>(null);
  const [currentLot, setCurrentLot] = useState<ParkingLotResponse | null>(null);

  const openModal = useCallback((modal: SettingsModalType, lotData?: ParkingLotResponse) => {
    setModals(prev => ({ ...prev, [modal]: true }));
    if (lotData) {
      setCurrentLot(lotData);
    }
  }, []);

  const closeModal = useCallback((modal: SettingsModalType) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    if (modal === 'lotSettings') {
      setCurrentLot(null);
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialModalState);
    setCurrentLot(null);
  }, []);

  const resetConfirmDelete = useCallback(() => {
    setConfirmDelete(null);
  }, []);

  return {
    modals,
    confirmDelete,
    currentLot,
    openModal,
    closeModal,
    closeAllModals,
    setConfirmDelete,
    resetConfirmDelete,
  };
}
