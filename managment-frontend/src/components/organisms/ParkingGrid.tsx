import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { addSpot, updateSpot, deleteSpot } from '../../stores/spotSlice';
import type { Spot, ParkingLot } from '../../types';
import Card from '../atoms/Card';
import SectorInfo from '../atoms/SectorInfo';
import SlotModal from '../molecules/SlotModal';
import SlotCard from '../molecules/SlotCard';

const ParkingGrid = () => {
  const dispatch = useAppDispatch();
  const { selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  const { spots } = useAppSelector((state) => state.spot);
  const [selectedSpot, setSelectedSpot] = useState<Spot | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | 'all'>('all');

  if (!selectedParkingLot) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay estacionamiento seleccionado</p>
      </div>
    );
  }

  const parkingLotSpots = spots.filter(spot => spot.parking_lot_id === selectedParkingLot.id);
  const spotsFiltered = selectedFloor === 'all' 
    ? parkingLotSpots 
    : parkingLotSpots.filter(spot => spot.floor === selectedFloor);

  const floors = [...new Set(parkingLotSpots.map(s => s.floor))].sort();

  const handleEditSpot = (spot: Spot) => {
    setSelectedSpot(spot);
    setIsModalOpen(true);
  };

  const handleAddSpot = () => {
    setSelectedSpot(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpot(undefined);
  };

  const handleSaveSpot = (spotData: Partial<Spot>) => {
    if (selectedSpot) {
      // Actualizar espacio existente
      dispatch(updateSpot({
        id: selectedSpot.id,
        updates: spotData
      }));
    } else {
      // Crear nuevo espacio
      const newSpot: Spot = {
        id: Date.now(), // ID temporal para mock data
        vehicle_type: spotData.vehicle_type || 'Car',
        floor: spotData.floor || '1',
        label: spotData.label || '',
        is_available: spotData.is_available ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        parking_lot_id: selectedParkingLot.id
      };
      dispatch(addSpot(newSpot));
    }
    handleCloseModal();
  };

  const handleDeleteSpot = (spotId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      dispatch(deleteSpot(spotId));
      handleCloseModal();
    }
  };

  const getSectorFromCode = (code: string): string => {
    const match = code.match(/^([A-Z]+)/);
    return match ? match[1] : 'General';
  };

  const spotsByFloorAndSector = spotsFiltered.reduce((acc, spot) => {
    if (!acc[spot.floor]) {
      acc[spot.floor] = {};
    }
    
    const sector = getSectorFromCode(spot.label);
    if (!acc[spot.floor][sector]) {
      acc[spot.floor][sector] = [];
    }
    
    acc[spot.floor][sector].push(spot);
    return acc;
  }, {} as Record<string, Record<string, Spot[]>>);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Gestión de Espacios
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filtrar por piso:</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los pisos</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>Piso {floor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Ocupado</span>
          </div>
          <p className="text-gray-600">Haz clic en un espacio para editarlo</p>
        </div>
      </Card>

      {spotsFiltered.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No hay espacios en este piso</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-4"
              onClick={handleAddSpot}
            >
              + Crear Primer Espacio
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(spotsByFloorAndSector).map(([floor, sectors]) => (
            <Card key={floor}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Piso {floor}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {Object.values(sectors).flat().length} espacios • 
                    {Object.values(sectors).flat().filter(s => s.is_available).length} disponibles
                  </p>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={handleAddSpot}
                >
                  + Agregar Espacio
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(sectors).map(([sector, sectorSpots]) => (
                  <div key={sector} className="border border-gray-200 rounded-lg p-4">
                    {/*<SectorInfo sector={sector} spots={sectorSpots} />*/}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Sector {sector}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {sectorSpots.length} espacios • 
                          {sectorSpots.filter(s => s.is_available).length} disponibles
                        </p>
                      </div>
                    </div>

                    {sectorSpots.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 mb-3">No hay espacios en este sector</p>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                          onClick={handleAddSpot}
                        >
                          Crear Primer Espacio
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {sectorSpots.map((spot) => (
                          <SlotCard
                            key={spot.id}
                            spot={spot}
                            onClick={handleEditSpot}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <SlotModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        spot={selectedSpot}
        parkingLotId={selectedParkingLot.id}
        onSave={handleSaveSpot}
        onDelete={handleDeleteSpot}
      />
    </div>
  );
};

export default ParkingGrid; 