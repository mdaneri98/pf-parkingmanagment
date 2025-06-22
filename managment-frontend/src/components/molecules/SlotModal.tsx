import { useState, useEffect } from 'react';
import type { Spot } from '../../types';

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  spot?: Spot;
  parkingLotId: number;
  onSave: (spotData: Partial<Spot>) => void;
}

const SlotModal = ({ isOpen, onClose, spot, parkingLotId, onSave }: SlotModalProps) => {
  const [formData, setFormData] = useState({
    code: '',
    vehicle_type: 'Car',
    floor: '1',
    is_available: true
  });

  const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van'];
  const floors = ['1', '2', '3', '4', '5'];

  useEffect(() => {
    if (spot) {
      setFormData({
        code: spot.code,
        vehicle_type: spot.vehicle_type,
        floor: spot.floor,
        is_available: spot.is_available
      });
    } else {
      setFormData({
        code: '',
        vehicle_type: 'Car',
        floor: '1',
        is_available: true
      });
    }
  }, [spot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const spotData: Partial<Spot> = {
      ...formData,
      parking_lot_id: parkingLotId
    };

    if (spot) {
      spotData.id = spot.id;
    }

    onSave(spotData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {spot ? 'Editar Espacio' : 'Crear Espacio'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del Espacio
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: A1, B2, C3..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              El código debe comenzar con una letra para sectorización automática
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Vehículo
            </label>
            <select
              value={formData.vehicle_type}
              onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piso
            </label>
            <select
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {floors.map(floor => (
                <option key={floor} value={floor}>Piso {floor}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => handleInputChange('is_available', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
              Espacio disponible
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {spot ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotModal; 