import { useState, useCallback } from 'react';
import type { ModalType, ModalState, ConfirmDeleteState } from '@parking/types';

const initialModalState: ModalState = {
  spotDetail: false,
  createSpot: false,
  editSpot: false,
};

export function useModalState() {
  const [modals, setModals] = useState<ModalState>(initialModalState);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState | null>(null);

  const openModal = useCallback((modal: ModalType) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: ModalType) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialModalState);
  }, []);

  const resetConfirmDelete = useCallback(() => {
    setConfirmDelete(null);
  }, []);

  return {
    modals,
    confirmDelete,
    openModal,
    closeModal,
    closeAllModals,
    setConfirmDelete,
    resetConfirmDelete,
  };
}
