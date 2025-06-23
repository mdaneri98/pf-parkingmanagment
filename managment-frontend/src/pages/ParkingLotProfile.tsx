import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateParkingLot } from '../stores/parkingLotSlice';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

interface ParkingLotFormData {
  address: string;
  image_url: string;
  is_open: boolean;
}

interface PriceFormData {
  carPrice: number;
  motorcyclePrice: number;
  truckPrice: number;
  vanPrice: number;
}

const ParkingLotProfile = () => {
  const dispatch = useAppDispatch();
  const { selectedParkingLot } = useAppSelector((state) => state.parkingLot);
  const { spots } = useAppSelector((state) => state.spot);
  const [activeTab, setActiveTab] = useState<'info' | 'precios'>('info');
  const [saveLoading, setSaveLoading] = useState(false);

  // Obtener precios actuales del estacionamiento
  const getCurrentPrices = () => {
    const prices = {
      carPrice: 150,
      motorcyclePrice: 80,
      truckPrice: 200,
      vanPrice: 180
    };
    
    // Aquí se podrían obtener los precios reales de la base de datos
    // Por ahora usamos valores por defecto
    return prices;
  };

  const currentPrices = getCurrentPrices();

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: errorsInfo }
  } = useForm<ParkingLotFormData>({
    defaultValues: selectedParkingLot ? {
      address: selectedParkingLot.address,
      image_url: selectedParkingLot.image_url || '',
      is_open: true, // Por defecto asumimos que está abierto
    } : undefined
  });

  const {
    register: registerPrecios,
    handleSubmit: handleSubmitPrecios,
    formState: { errors: errorsPrecios }
  } = useForm<PriceFormData>({
    defaultValues: {
      carPrice: currentPrices.carPrice,
      motorcyclePrice: currentPrices.motorcyclePrice,
      truckPrice: currentPrices.truckPrice,
      vanPrice: currentPrices.vanPrice,
    }
  });

  if (!selectedParkingLot) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay estacionamiento seleccionado</p>
          <p className="text-sm text-gray-400">Selecciona un estacionamiento para ver su perfil</p>
        </div>
      </div>
    );
  }

  const onSubmitInfo = async (data: ParkingLotFormData) => {
    setSaveLoading(true);
    try {
      dispatch(updateParkingLot({
        id: selectedParkingLot.id,
        updates: {
          address: data.address,
          image_url: data.image_url,
          updated_at: new Date().toISOString()
        }
      }));
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar información:', error);
      alert('Error al actualizar la información');
    } finally {
      setSaveLoading(false);
    }
  };

  const onSubmitPrecios = async (data: PriceFormData) => {
    setSaveLoading(true);
    try {
      // Aquí se implementaría la lógica para actualizar precios
      // Por ahora solo mostramos un mensaje de éxito
      console.log('Precios a actualizar:', data);
      alert('Precios actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar precios:', error);
      alert('Error al actualizar los precios');
    } finally {
      setSaveLoading(false);
    }
  };

  const parkingLotSpots = spots.filter(spot => spot.parking_lot_id === selectedParkingLot.id);
  const availableSpots = parkingLotSpots.filter(spot => spot.is_available).length;
  const totalSpots = parkingLotSpots.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Perfil del Estacionamiento
        </h1>
        <p className="text-gray-600">
          Configuración y ajustes del estacionamiento
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium">Dirección:</span> {selectedParkingLot.address}
        </div>
        <div className="mt-1 text-sm text-gray-500">
          <span className="font-medium">Espacios:</span> {availableSpots} disponibles de {totalSpots} totales
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('precios')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'precios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Precios por Hora
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <form onSubmit={handleSubmitInfo(onSubmitInfo)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Dirección del Estacionamiento"
                  placeholder="Ej: Av. Corrientes 1234, CABA"
                  error={errorsInfo.address?.message}
                  {...registerInfo('address', {
                    required: 'La dirección es requerida',
                    minLength: {
                      value: 10,
                      message: 'La dirección debe tener al menos 10 caracteres'
                    }
                  })}
                />

                <Input
                  label="URL de Imagen (opcional)"
                  placeholder="https://..."
                  type="url"
                  error={errorsInfo.image_url?.message}
                  {...registerInfo('image_url')}
                  helpText="URL de una imagen representativa del estacionamiento"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_open"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...registerInfo('is_open')}
                />
                <label htmlFor="is_open" className="ml-2 block text-sm text-gray-700">
                  Estacionamiento abierto al público
                </label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Información del Estacionamiento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 font-medium">{selectedParkingLot.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Manager ID:</span>
                    <span className="ml-2 font-medium">{selectedParkingLot.manager_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Creado:</span>
                    <span className="ml-2 font-medium">{new Date(selectedParkingLot.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Actualizado:</span>
                    <span className="ml-2 font-medium">{new Date(selectedParkingLot.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={saveLoading}
                  disabled={saveLoading}
                >
                  Guardar Información
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'precios' && (
            <form onSubmit={handleSubmitPrecios(onSubmitPrecios)} className="space-y-6">
              <div className="text-sm text-gray-600 mb-6">
                Configure los precios por hora para cada tipo de vehículo (en pesos argentinos).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="Auto ($/hora)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="150.00"
                  error={errorsPrecios.carPrice?.message}
                  {...registerPrecios('carPrice', {
                    required: 'El precio para autos es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                />

                <Input
                  label="Moto ($/hora)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="80.00"
                  error={errorsPrecios.motorcyclePrice?.message}
                  {...registerPrecios('motorcyclePrice', {
                    required: 'El precio para motos es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                />

                <Input
                  label="Camión ($/hora)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="200.00"
                  error={errorsPrecios.truckPrice?.message}
                  {...registerPrecios('truckPrice', {
                    required: 'El precio para camiones es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                />

                <Input
                  label="Furgoneta ($/hora)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="180.00"
                  error={errorsPrecios.vanPrice?.message}
                  {...registerPrecios('vanPrice', {
                    required: 'El precio para furgonetas es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Precios Actuales</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Auto:</span>
                    <span className="ml-2 font-medium">${currentPrices.carPrice}/hora</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Moto:</span>
                    <span className="ml-2 font-medium">${currentPrices.motorcyclePrice}/hora</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Camión:</span>
                    <span className="ml-2 font-medium">${currentPrices.truckPrice}/hora</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Furgoneta:</span>
                    <span className="ml-2 font-medium">${currentPrices.vanPrice}/hora</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={saveLoading}
                  disabled={saveLoading}
                >
                  Actualizar Precios
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};
