import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { openModal, closeModal, closeAllModals } from '@walkinstays/slice/walkInStaySlice';
import type { WalkInStayModalType } from '@walkinstays/types';

/**
 * Hook for managing walk-in stay modal state
 */
export const useWalkInStayModalState = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.walkInStay.modalState);

  const handleOpenModal = useCallback(
    (modalType: WalkInStayModalType) => {
      dispatch(openModal(modalType));
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(
    (modalType: WalkInStayModalType) => {
      dispatch(closeModal(modalType));
    },
    [dispatch]
  );

  const handleCloseAllModals = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  return {
    modalState,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    closeAllModals: handleCloseAllModals,
  };
};

