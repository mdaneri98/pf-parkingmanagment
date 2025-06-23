import { useState, useEffect } from 'react';
import type { Spot } from '../../types';

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  spot?: Spot;
  parkingLotId: number;
  onSave: (spotData: Partial<Spot>) => void;
  onDelete?: (spotId: number) => void;
}

const SlotModal = ({ isOpen, onClose, spot, parkingLotId, onSave, onDelete }: SlotModalProps) => {
  const [formData, setFormData] = useState({
    label: '',
    vehicle_type: 'Car',
    floor: '1',
    is_available: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Van'];
  const floors = ['1', '2', '3', '4'];

  useEffect(() => {
    if (spot) {
      setFormData({
        label: spot.label,
        vehicle_type: spot.vehicle_type,
        floor: spot.floor,
        is_available: spot.is_available
      });
    } else {
      setFormData({
        label: '',
        vehicle_type: 'Car',
        floor: '1',
        is_available: true
      });
    }
    setErrors({});
  }, [spot]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'El código del espacio es requerido';
    } else if (formData.label.trim().length < 2) {
      newErrors.label = 'El código debe tener al menos 2 caracteres';
    }

    if (!formData.vehicle_type) {
      newErrors.vehicle_type = 'El tipo de vehículo es requerido';
    }

    if (!formData.floor) {
      newErrors.floor = 'El piso es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const spotData: Partial<Spot> = {
      ...formData,
      parking_lot_id: parkingLotId
    };

    if (spot) {
      spotData.id = spot.id;
    }

    onSave(spotData);
  };

  const handleDelete = () => {
    if (spot && onDelete) {
      onDelete(spot.id);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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
              Código del Espacio *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: A1, B2, 101, 102..."
              required
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">{errors.label}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Vehículo *
            </label>
            <select
              value={formData.vehicle_type}
              onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.vehicle_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.vehicle_type && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicle_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piso *
            </label>
            <select
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.floor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {floors.map(floor => (
                <option key={floor} value={floor}>Piso {floor}</option>
              ))}
            </select>
            {errors.floor && (
              <p className="text-red-500 text-xs mt-1">{errors.floor}</p>
            )}
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
            {spot && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Eliminar
              </button>
            )}
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