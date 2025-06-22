import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectParkingLotByManagerId } from '../stores/parkingLotSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useAppDispatch();
  const { parkingLots, selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  
  const loggedInManagerId = 1; // Manager ID fijo para esta aplicación
  const managerParkingLot = parkingLots.find(lot => lot.manager_id === loggedInManagerId);

  useEffect(() => {
    // Seleccionar automáticamente el parking lot del manager con ID 1
    if (managerParkingLot && !selectedParkingLot) {
      dispatch(selectParkingLotByManagerId(loggedInManagerId));
    }
  }, [dispatch, managerParkingLot, selectedParkingLot, loggedInManagerId]);

  return <>{children}</>;
};

export default AppInitializer; 